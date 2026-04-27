import ngoSchemaModel from '../model/ngomodel.js';
import url from 'url';
import jwt from 'jsonwebtoken';
import rs from 'randomstring';
import bcrypt from 'bcryptjs';
import { sendStatusEmail, sendOtpEmail } from './emailcontroller.js';


// 🔑 STEP 1: Request Password Reset (Send OTP)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const lowerEmail = email ? email.toLowerCase().trim() : "";
  console.log(`🔍 Received Forgot Password request for: "${lowerEmail}"`);
  
  try {
    const ngo = await ngoSchemaModel.findOne({ 
      email: { $regex: new RegExp(`^${lowerEmail}$`, 'i') } 
    });
    if (!ngo) {
      console.log(`❌ No account found for email: "${lowerEmail}"`);
      return res.status(404).json({ result: "Email not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 Minutes

    await ngoSchemaModel.updateOne(
      { email: ngo.email },
      { $set: { resetOtp: otp, resetOtpExpires: expiry } }
    );

    await sendOtpEmail(email, otp);
    res.status(200).json({ result: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔑 STEP 2: Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const lowerEmail = email ? email.toLowerCase().trim() : "";

  try {
    const ngo = await ngoSchemaModel.findOne({ 
      email: lowerEmail, 
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() } 
    });

    if (!ngo) {
      return res.status(400).json({ result: "Invalid or expired OTP" });
    }

    res.status(200).json({ result: "OTP verified. You can now reset your password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔑 STEP 3: Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const lowerEmail = email ? email.toLowerCase().trim() : "";

  try {
    const ngo = await ngoSchemaModel.findOne({ 
      email: lowerEmail, 
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() } 
    });

    if (!ngo) {
      return res.status(400).json({ result: "Verification failed. Please try again." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await ngoSchemaModel.updateOne(
      { email: lowerEmail },
      { 
        $set: { password: hashedPassword },
        $unset: { resetOtp: 1, resetOtpExpires: 1 } 
      }
    );

    res.status(200).json({ result: "Password reset successful! Please login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const save = async (req, res) => {
  const ngoList = await ngoSchemaModel.find().sort({ _id: -1 }).limit(1);
  const _id = (ngoList.length === 0) ? 1 : ngoList[0]._id + 1;
  var ngoDetail = req.body;
  if (ngoDetail.email) ngoDetail.email = ngoDetail.email.toLowerCase().trim();
  ngoDetail = { ...ngoDetail, "_id": _id, "role": "ngo", "status": 0, "info": Date() }
  
  try {
    const salt = await bcrypt.genSalt(10);
    ngoDetail.password = await bcrypt.hash(ngoDetail.password, salt);

    const ngos = await ngoSchemaModel.create(ngoDetail);
    res.status(201).json({ "status": true });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ "status": false });
  }
}

export const fetch = async (req, res) => {
  var condition_obj = url.parse(req.url, true).query;
  var ngo = await ngoSchemaModel.find(condition_obj)
  if (ngo.length != 0) {
    res.status(200).json({
      "ngo": ngo
    })
  } else {
    res.status(404).json({
      "result": "not found"
    })
  }
}


//to update
export const update = async (req, res) => {
  var condition_obj = req.body.condition_obj;
  var content_obj = req.body.content_obj;
  
  try {
    var ngo = await ngoSchemaModel.findOne(condition_obj);
    if (!ngo) {
      return res.status(404).json({ "result": "NGO not found" });
    }

    // If password is being updated, hash it
    if (content_obj.password) {
      const salt = await bcrypt.genSalt(10);
      content_obj.password = await bcrypt.hash(content_obj.password, salt);
    }

    var update_ngo = await ngoSchemaModel.updateOne(condition_obj, { $set: content_obj });
    if (update_ngo) {
      if (content_obj.status === 1) {
        await sendStatusEmail(ngo.email, ngo.name, "approved");
      } else if (content_obj.status === 0) {
        await sendStatusEmail(ngo.email, ngo.name, "blocked");
      }
      res.status(200).json({ "result": "Updated successfully" });
    } else {
      res.status(500).json({ "result": "Update failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ "error": "Internal server error" });
  }
}



//delete controller

export const deleteNgo = async (req, res) => {
  var ngo = await ngoSchemaModel.findOne(req.body);
  console.log(ngo);
  if (ngo) {
    var delete_ngo = await ngoSchemaModel.deleteOne(req.body);
    if (delete_ngo) {
      await sendStatusEmail(ngo.email, ngo.name, "rejected");
      res.status(200).json({ "result": "ngo-deleted successfully" });

    } else {
      res.status(500).json({ "result": "resource cant deleyted successfully" });
    }
  }
  else {
    res.status(404).json({ "result": "ngo not found in database" });
  }
}

//to login
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Attempt:", email);

  try {
    const ngo = await ngoSchemaModel.findOne({ email });

    if (!ngo) {
      return res.status(401).json({ "result": "Invalid email or password" });
    }

    // Compare hashed password with fallback for old plaintext passwords
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, ngo.password);
    } catch (e) {
      console.log("Bcrypt comparison failed, checking fallback...");
    }

    if (!isMatch && password === ngo.password) {
      isMatch = true; // Allow plaintext login for legacy accounts
    }

    if (!isMatch) {
      return res.status(401).json({ "result": "Invalid email or password" });
    }

    if (ngo.status === 0 && ngo.role === "ngo") {
      return res.status(403).json({ "result": "Account pending admin approval" });
    }

    const payload = { "subject": ngo.email };
    const key = process.env.JWT_SECRET || 'resqpet_secret_key_123';
    const token = jwt.sign(payload, key);

    res.status(200).json({ "token": token, "ngoList": ngo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ "error": "Internal server error" });
  }
}
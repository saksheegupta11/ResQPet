import rescueSchemaModel from '../model/rescuemodel.js';
import ngoSchemaModel from '../model/ngomodel.js';
//import { sendSms } from '../utils/sendsms.js';
// import { sendWhatsapp } from '../utils/sendWhatsapp.js';

import url from 'url';
import rs from 'randomstring';
import path from 'path';
import { sendRescueAssignmentEmail, sendAdminRescueAlert, sendRescueResolvedEmail } from './emailcontroller.js';

export const save = async (req, res) => {
  const rescueList = await rescueSchemaModel.find();
  const _id = rescueList.length === 0 ? 1 : rescueList[rescueList.length - 1]._id + 1;

  const animalImage = req.files.animalImage;
  const animalImageName = rs.generate() + "-" + Date.now() + "-" + animalImage.name;

  const { mobile, location, city, description, reporterEmail } = req.body;
  const trimmedCity = city?.trim();

  console.log(`🔍 Searching for NGO in city: "${trimmedCity}"`);

  // 🔍 Find first available approved NGO in the same city (case-insensitive)
  console.log(`🔎 Searching for NGO in city: "${trimmedCity}"`);
  
  const nearbyNgo = await ngoSchemaModel.findOne({
    city: { $regex: new RegExp(`^${trimmedCity}$`, 'i') }, 
    status: 1
  });

  const assignedNgoId = nearbyNgo ? nearbyNgo._id : null;
  console.log(nearbyNgo ? `✅ MATCH SUCCESS: Found NGO "${nearbyNgo.name}" (ID: ${assignedNgoId})` : `⚠️ MATCH FAILURE: No active NGO found in city "${trimmedCity}"`);
  
  if (nearbyNgo) {
    console.log(`📧 Sending assignment email to: ${nearbyNgo.email}`);
    sendRescueAssignmentEmail(nearbyNgo.email, nearbyNgo.name, location, trimmedCity);
  } else {
    console.log(`📢 No NGO found. Sending alert to admin.`);
    sendAdminRescueAlert(location, trimmedCity, "No approved NGO registered in this city.");
  }

  const reqDetails = {
    _id,
    mobile,
    location,
    city: trimmedCity,
    description: description || "No description provided.",
    reporterEmail: reporterEmail || "Anonymous",
    animalImage: animalImageName,
    animalImageName: animalImageName,
    assignedNgo: assignedNgoId,
    status: "pending",
    rejectedBy: []
  };

  try {
    await rescueSchemaModel.create(reqDetails);
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const uploadPath = path.join(__dirname, "../../UI/public/assests/upload/petimages", animalImageName);
    animalImage.mv(uploadPath);

    res.status(201).json({ status: true, assignedNgo: nearbyNgo?.email || "No NGO found" });
  } catch (error) {
    console.error("❌ Error saving rescue request:", error);
    res.status(500).json({ status: false });
  }
}

//fetch or read
export const fetch = async (req, res) => {
  const query = url.parse(req.url, true).query;
  let condition_obj = { ...query };
  
  // If role is NGO, ensure we only find requests assigned to them OR in their city/location
  if (query.role === 'ngo') {
    const filters = [];
    
    // Fallback 1: Assigned to NGO ID
    if (query.ngoId && query.ngoId !== 'undefined' && query.ngoId !== 'null') {
      const idNum = Number(query.ngoId);
      if (!isNaN(idNum)) filters.push({ assignedNgo: idNum });
    }
    
    // Fallback 2: Match by City (Case-insensitive) or Location keyword
    if (query.city && query.city !== 'undefined' && query.city !== 'null') {
      filters.push({ city: { $regex: new RegExp(`^${query.city}$`, 'i') } });
      filters.push({ location: { $regex: new RegExp(query.city, 'i') } });
    }

    if (filters.length > 0) {
      condition_obj = { $or: filters };
    }
    
    // Clean up query params that shouldn't be in the final mongo query
    delete query.role;
    delete query.ngoId;
    delete query.city;
  }

  console.log("📂 MongoDB Query Condition:", JSON.stringify(condition_obj));

  try {
    const rescue = await rescueSchemaModel.find(condition_obj).populate('assignedNgo');
    res.status(200).json({ "rescue": rescue });
  } catch (err) {
    res.status(500).json({ "error": err.message });
  }
}

//to delete
export const remove = async (req, res) => {
  var rescue = await rescueSchemaModel.findOne(JSON.parse(req.body.condition_obj));
  if (rescue) {
    var delete_rescue = await rescueSchemaModel.deleteOne(JSON.parse(req.body.condition_obj));
    if (delete_rescue) {
      res.status(200).json({ "result": "rescue-deleted successfully" });
    } else {
      res.status(500).json({ "result": "rescue can't deleted successfully" });
    }
  } else {
    res.status(404).json({ "result": "item not found" });
  }
}

//to update (Includes Rejection Logic)
export const update = async (req, res) => {
  const { condition_obj, content_obj } = req.body;

  try {
    // Force _id to Number for reliable matching
    if (condition_obj._id) {
        condition_obj._id = Number(condition_obj._id);
    }

    console.log("🛠️ Updating Rescue Case:", condition_obj, "with data:", content_obj);

    const existing = await rescueSchemaModel.findOne(condition_obj);
    if (!existing) {
        console.log("❌ Case not found for update");
        return res.status(404).json({ error: 'Rescue case not found' });
    }

    // --- 🚨 REJECTION LOGIC (IF NGO REJECTS) ---
    if (content_obj.action === 'reject') {
        const rejectedByList = existing.rejectedBy || [];
        rejectedByList.push(existing.assignedNgo);
        
        console.log(`❌ NGO ${existing.assignedNgo} rejected. Finding next...`);

        const nextNgo = await ngoSchemaModel.findOne({
            city: { $regex: new RegExp(`^${existing.city}$`, 'i') },
            status: 1,
            _id: { $nin: rejectedByList }
        });

        if (nextNgo) {
            content_obj.assignedNgo = nextNgo._id;
            content_obj.rejectedBy = rejectedByList;
            content_obj.status = 'pending';
            console.log(`👉 Re-assigned to NGO: ${nextNgo._id}`);
            sendRescueAssignmentEmail(nextNgo.email, nextNgo.name, existing.location, existing.city);
        } else {
            content_obj.assignedNgo = null;
            content_obj.rejectedBy = rejectedByList;
            content_obj.status = 'pending';
            console.log("⏹️ No more NGOs available. Alerting Admin.");
            sendAdminRescueAlert(existing.location, existing.city, "All available NGOs in this city have rejected this case.");
        }
    }

    // --- ✅ ACCEPTANCE & RESOLUTION LOGIC ---
    if (content_obj.action === 'accept') {
        content_obj.status = 'accepted';
        console.log("✅ Case accepted by NGO");
    } else if (content_obj.action === 'resolve') {
        content_obj.status = 'resolved';
        console.log("🏆 Case resolved/rescued");
        // Notify Reporter
        sendRescueResolvedEmail(existing.reporterEmail, existing.location, existing.city);
    }
    
    delete content_obj.action;

    let result;
    if (condition_obj._id) {
        result = await rescueSchemaModel.findByIdAndUpdate(
            condition_obj._id,
            { $set: content_obj },
            { new: true }
        );
    } else {
        result = await rescueSchemaModel.findOneAndUpdate(
            condition_obj, 
            { $set: content_obj },
            { new: true }
        );
    }
    
    if (result) {
        console.log("✅ DB Update Successful. New Status:", result.status);
        res.status(200).json({ result: 'Rescue request updated successfully - v2', status: result.status });
    } else {
        console.log("❌ DB Update Failed: No document matched.");
        res.status(500).json({ result: "Update failed: Case not found" });
    }

  } catch (err) {
    console.error("❌ Error updating rescue request:", err);
    res.status(500).json({ result: "Internal server error" });
  }
};
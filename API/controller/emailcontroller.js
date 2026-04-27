import nodemailer from "nodemailer";

// 📧 Transporter configuration using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📨 Generic status-based mail
export const sendStatusEmail = async (toEmail, ngoName, status) => {
  let subject = "";
  let body = "";

  if (status === "approved") {
    subject = "Your NGO has been approved!";
    body = `<p>Dear <strong>${ngoName}</strong>,<br><br>
      🎉 Congratulations! Your NGO has been <strong>approved</strong> by the ResQPet Admin.<br>
      You can now log in and start participating in pet rescue operations.<br><br>
      Thank you for being part of the mission 🐾<br><br>
      Regards,<br><strong>ResQPet Team</strong>
    </p>`;
  } else if (status === "blocked") {
    subject = "Your NGO account has been blocked";
    body = `<p>Dear <strong>${ngoName}</strong>,<br><br>
      ⚠️ Your NGO account has been <strong>blocked</strong> by the ResQPet Admin.<br>
      This may be due to violations of our guidelines or suspicious activity.<br>
      Please contact the admin for clarification.<br><br>
      Regards,<br><strong>ResQPet Team</strong>
    </p>`;
  } else if (status === "rejected") {
    subject = "Your NGO registration has been rejected";
    body = `<p>Dear <strong>${ngoName}</strong>,<br><br>
      ❌ We're sorry to inform you that your NGO registration has been <strong>rejected</strong> by the ResQPet Admin.<br>
      You may revise your information and apply again if needed.<br><br>
      Thank you for your interest.<br><br>
      Regards,<br><strong>ResQPet Team</strong>
    </p>`;
  }

  const mailOptions = {
    from: `"ResQPet Team" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    return { success: true, response: info.response };
  } catch (error) {
    console.error("❌ Email failed to send:", error.message);
    return { success: false, error: error.message };
  }
};

// 🐾 Alert NGO about assigned rescue request
export const sendRescueAssignmentEmail = async (ngoEmail, ngoName, location, city) => {
  const mailOptions = {
    from: `"ResQPet Alert" <${process.env.EMAIL_USER}>`,
    to: ngoEmail,
    subject: "🚨 Urgent: New Rescue Case Assigned",
    html: `<p>Dear <strong>${ngoName}</strong>,<br><br>
      A new pet rescue request has been reported in <strong>${city}</strong> and assigned to your NGO.<br><br>
      📍 <strong>Location:</strong> ${location}<br>
      🏙️ <strong>City:</strong> ${city}<br><br>
      Please log in to your dashboard to view full details and take action.<br><br>
      Thank you for your quick response! 🐾<br><br>
      Regards,<br><strong>ResQPet Team</strong>
    </p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Assignment alert sent to NGO:", info.response);
  } catch (error) {
    console.error("❌ Failed to alert NGO:", error.message);
  }
};

// 👮 Notify Admin when no NGO is available or all rejected
export const sendAdminRescueAlert = async (location, city, reason) => {
    const mailOptions = {
        from: `"ResQPet System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: "⚠️ Attention: Unassigned Rescue Request",
        html: `<p>Dear Admin,<br><br>
          A pet rescue request in <strong>${city}</strong> is currently <strong>unassigned</strong>.<br><br>
          📍 <strong>Location:</strong> ${location}<br>
          🏙️ <strong>City:</strong> ${city}<br>
          🚨 <strong>Alert:</strong> ${reason}<br><br>
          Please review the case on your dashboard and assign an NGO manually if possible.<br><br>
          Regards,<br><strong>ResQPet System</strong>
        </p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Admin alert sent for unassigned case.");
    } catch (error) {
        console.error("❌ Failed to alert Admin:", error.message);
    }
};
// 🏆 Notify Reporter about successful rescue
export const sendRescueResolvedEmail = async (reporterEmail, location, city) => {
    if (!reporterEmail || reporterEmail === "Anonymous") {
        console.log("ℹ️ Skipping resolution email: Reporter is anonymous.");
        return;
    }

    const mailOptions = {
        from: `"ResQPet Success" <${process.env.EMAIL_USER}>`,
        to: reporterEmail,
        subject: "🎉 Good News: The animal has been rescued!",
        html: `<p>Dear Reporter,<br><br>
          We are happy to inform you that the animal you reported in <strong>${city}</strong> has been successfully <strong>rescued</strong> by our partner NGO! 🐾<br><br>
          📍 <strong>Location:</strong> ${location}<br>
          🏙️ <strong>City:</strong> ${city}<br><br>
          Thank you for your kindness and for taking the initiative to save a life. You have made a real difference today!<br><br>
          With gratitude,<br><strong>ResQPet Team</strong>
        </p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Resolution email sent to reporter:", info.response);
    } catch (error) {
        console.error("❌ Failed to send resolution email:", error.message);
    }
};

// 🔑 Send OTP for Password Reset
export const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"ResQPet Security" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Verification Code for Password Reset",
        html: `<p>Hello,<br><br>
          You requested to reset your password. Please use the following 6-digit One-Time Password (OTP) to verify your account:<br><br>
          <strong style="font-size: 24px; color: #4F46E5; letter-spacing: 5px;">${otp}</strong><br><br>
          This code is valid for <strong>3 minutes</strong>. If you did not request this, please ignore this email.<br><br>
          Regards,<br><strong>ResQPet Security Team</strong>
        </p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${toEmail}`);
    } catch (error) {
        console.error("❌ Failed to send OTP email:", error.message);
    }
};


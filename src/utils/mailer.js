const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a notification email when a new contact message is received.
 * @param {Object} contactDetails - The contact message details (name, email, phone, message)
 */
const sendContactNotification = async (contactDetails) => {
  const { name, email, phone, message } = contactDetails;

  const mailOptions = {
    from: `"Portfolio Alerts" <${email}>`,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `🔔 New Contact Message from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e6e6e6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background: linear-gradient(90deg, #ff7a00, #ff9a3c); padding: 20px; color: white;">
    <h2 style="margin: 0;">📩 New Contact Message</h2>
    <p style="margin: 5px 0 0; font-size: 14px;">You’ve received a new message from your portfolio</p>
  </div>

  <!-- Body -->
  <div style="padding: 20px; color: #333;">
    
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 8px 0;"><strong>Name:</strong></td>
        <td style="padding: 8px 0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Email:</strong></td>
        <td style="padding: 8px 0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Phone:</strong></td>
        <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
      </tr>
    </table>

    <!-- Message Box -->
    <div style="margin-top: 20px;">
      <p style="margin-bottom: 8px;"><strong>Message:</strong></p>
      <div style="background-color: #f4f6f8; padding: 15px; border-radius: 8px; border-left: 4px solid #ff7a00;">
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
    </div>

  </div>

  <!-- Footer -->
  <div style="background-color: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #777;">
    <p style="margin: 0;">This message was sent from your portfolio contact form</p>
    <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Kishore Kumar Portfolio</p>
  </div>

</div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send notification email:', error.message);
    return false;
  }
};

module.exports = { sendContactNotification };

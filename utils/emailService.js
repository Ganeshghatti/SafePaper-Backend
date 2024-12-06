const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ganeshghatti6@gmail.com',
    pass: 'yqts ygjo qazv vcan'
  }
});

const sendKeyShare = async (guardianEmail, keyShare, paperSetterName) => {
  console.log(`Attempting to send key share to guardian: ${guardianEmail}`);
  
  const mailOptions = {
    from: 'ganeshghatti6@gmail.com',
    to: guardianEmail,
    subject: 'SafePaper - Your Question Paper Key Share',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; text-align: center;">SafePaper Security Key Share</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p>You have been selected as a guardian for a question paper set by ${paperSetterName}.</p>
          
          <p style="background-color: #e9ecef; padding: 15px; border-radius: 5px; font-family: monospace;">
            Your Key Share: <strong>${keyShare}</strong>
          </p>
          
          <p style="color: #721c24; background-color: #f8d7da; padding: 10px; border-radius: 5px;">
            🔒 Please keep this key secure. It will be required on the exam day.
          </p>
        </div>
        
        <p style="color: #6c757d; font-size: 0.9em; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendKeyShare };

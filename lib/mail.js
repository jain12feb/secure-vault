// const { Resend } = require("resend");
import nodemailer from "nodemailer";

// const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  try {
    const confirmLink = `http://localhost:3000/verify?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `SecureVault <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" bgcolor="#f7f7f7" style="padding: 20px 0;">
                <h1>Verify Your Email Address</h1>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" style="padding: 20px;">
                <p>Hi ${email},</p>
                <p>Welcome to SecureVault! We’re excited to have you join us.</p>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <p>Link only valid for 5 minutes.</p>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="${confirmLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
                </p>
                <p>If you did not create an account with us, you can ignore this email.</p>
                <p>Thank you,<br>SecureVault Team</p>
            </td>
        </tr>
    </table>

</body>
  `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetLink = `http://localhost:3000/new-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `SecureVault <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password reset email",
      html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" bgcolor="#f7f7f7" style="padding: 20px 0;">
                <h1>Generate new Password</h1>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" style="padding: 20px;">
                <p>Hi ${email},</p>
                <p>To generate new password, click the button below:</p>
                <p>Link only valid for 5 minutes.</p>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                </p>
                <p>If you did not create a password reset request, you can ignore this email.</p>
                <p>Thank you,<br>SecureVault Team</p>
            </td>
        </tr>
    </table>

</body>
  `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendTwoFactorTokenEmail = async (email, token) => {
  try {
    // const resetLink = `http://localhost:3000/new-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `SecureVault <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Two-Factor Authentication Code",
      html: `<div
      style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #333;">Two-Factor Authentication Code</h2>
      <p style="text-align: center; color: #666; margin-top: 20px;">Dear ${email},</p>
      <p style="text-align: center; color: #666;">Your two-factor authentication code is:</p>
      <div style="text-align: center; margin-top: 20px;">
          <h1 style="font-size: 36px; color: #007bff;">${token}</h1>
          <p style="color: #666;">This code will expire in 5 minutes.</p>
      </div>
      <p style="text-align: center; color: #666; margin-top: 20px;">Best regards,<br>Your Company</p>
  </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

// export const sendVerificationEmail = async (email, token) => {
//   const confirmLink = `http://localhost:3000/verify?token=${token}`;

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Verify your email address",
//     html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

//     <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
//         <tr>
//             <td align="center" bgcolor="#f7f7f7" style="padding: 20px 0;">
//                 <h1>Verify Your Email Address</h1>
//             </td>
//         </tr>
//         <tr>
//             <td bgcolor="#ffffff" style="padding: 20px;">
//                 <p>Hi ${email},</p>
//                 <p>Welcome to Next Auth v5! We’re excited to have you join us.</p>
//                 <p>To complete your registration, please verify your email address by clicking the button below:</p>
//                 <p style="text-align: center; margin-top: 30px;">
//                     <a href="${confirmLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
//                 </p>
//                 <p>If you did not create an account with us, you can ignore this email.</p>
//                 <p>Thank you,<br>Next Auth v5 Team</p>
//             </td>
//         </tr>
//     </table>

// </body>
//   `,
//     // html: `<p>Please click the link below to verify your email address:</p><a href=${confirmLink}>Verify Email</a>`,
//   });
// };

import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const isSmtpValid = process.env.SMTP_USER &&
    !process.env.SMTP_USER.includes('your_email') &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_PASS.includes('your_app_password');

  if (!isSmtpValid) {
    console.log(`⚠️ SMTP not configured with real credentials. Skipping email send for ${to}.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    await transporter.sendMail({
      from: `"Elvane Wear" <${process.env.FROM_EMAIL || 'noreply@elvanewear.com'}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.log(`⚠️ Email sending failed: ${error.message}`);
    return false;
  }
};

export default sendEmail;

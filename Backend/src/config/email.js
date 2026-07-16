const nodemailer = require('nodemailer');

// Tạo SMTP transporter
const createTransporter = () => {
  // Development mode: dùng console log thay vì gửi email thật
  if (process.env.NODE_ENV === 'development' && process.env.SMTP_PASS === 'email-password-here') {
    console.log('📧 Email: Dev mode - emails will be logged to console');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true cho port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Gửi email
 * @param {string} to - Email người nhận
 * @param {string} subject - Tiêu đề
 * @param {string} html - Nội dung HTML
 * @param {Object} options - { cc, attachments }
 */
const sendMail = async (to, subject, html, options = {}) => {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
    ...options,
  };

  const transport = getTransporter();

  // Dev mode fallback: log ra console
  if (!transport) {
    console.log('═══════════════════════════════════════');
    console.log('📧 EMAIL (Dev Mode - Not Actually Sent)');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    if (options.cc) console.log(`   CC: ${options.cc}`);
    console.log('═══════════════════════════════════════');
    return { messageId: 'dev-mode-' + Date.now() };
  }

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId} → ${to}`);
    return info;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    throw error;
  }
};

module.exports = { sendMail, getTransporter };

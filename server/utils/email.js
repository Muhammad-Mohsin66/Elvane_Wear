import { Resend } from 'resend';
import nodemailer from 'nodemailer';

/**
 * Universal Email Sender with Resend & SMTP Support
 */
export const sendEmail = async ({ to, subject, html }) => {
  // 1. Try Resend if RESEND_API_KEY is available
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = process.env.RESEND_FROM || process.env.FROM_EMAIL || 'Elvane Wear <onboarding@resend.dev>';
      
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error('❌ Resend email error:', error);
      } else {
        console.log(`📧 [Resend] Email delivered to ${to} (ID: ${data?.id})`);
        return true;
      }
    } catch (err) {
      console.error('❌ Resend sending exception:', err.message);
    }
  }

  // 2. Fallback to Nodemailer SMTP if configured
  const isSmtpValid =
    process.env.SMTP_USER &&
    !process.env.SMTP_USER.includes('your_email') &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_PASS.includes('your_app_password');

  if (isSmtpValid) {
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
      console.log(`📧 [SMTP] Email sent to ${to}`);
      return true;
    } catch (error) {
      console.error(`⚠️ [SMTP] Failed: ${error.message}`);
    }
  }

  // 3. Fallback Logger for Development / Pre-configuration
  console.log(`\n==================================================`);
  console.log(`📧 SIMULATED EMAIL DISPATCH (Configure RESEND_API_KEY in server/.env)`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`==================================================\n`);
  return true;
};

/**
 * Luxury HTML Email Template Wrapper
 */
const getLuxuryEmailWrapper = (contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elvane Wear</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F6F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F6F3; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E5DF; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 36px 32px 20px; border-bottom: 1px solid #F0EEE9; background-color: #FAFAFA;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.15em; font-weight: 700; color: #1A1A1A; text-transform: uppercase;">ELVANE WEAR</h1>
              <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 0.2em; color: #8F8B82; text-transform: uppercase;">Luxury 2-Piece Tracksuits</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 32px; background-color: #FAFAFA; border-top: 1px solid #F0EEE9; font-size: 12px; color: #8F8B82; line-height: 1.6;">
              <p style="margin: 0 0 8px;"><strong>Elvane Wear Pakistan</strong> • 100% Cash on Delivery</p>
              <p style="margin: 0;">For inquiries or sizing assistance, contact us at <a href="mailto:support@elvanewears.com" style="color: #D4A76A; text-decoration: none;">support@elvanewears.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * 1. Email: Order Placed (Sent immediately when order is submitted)
 */
export const sendOrderPlacedEmail = async (order, userEmail, userName) => {
  const recipientEmail = userEmail || order.shippingAddress?.email;
  const recipientName = userName || order.shippingAddress?.fullName || 'Valued Customer';
  const clientUrl = process.env.CLIENT_URL || 'https://elvanewears.com';
  const trackingUrl = `${clientUrl}/track?order=${order.orderNumber}`;

  const itemsHtml = order.items.map(it => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #F0EEE9;">
        <strong style="color: #1A1A1A; font-size: 14px;">${it.title}</strong><br>
        <span style="font-size: 12px; color: #8F8B82;">Color: ${it.color} • Size: ${it.size} • Qty: ${it.quantity}</span>
      </td>
      <td align="right" style="padding: 10px 0; border-bottom: 1px solid #F0EEE9; font-weight: 600; color: #1A1A1A; font-size: 14px;">
        Rs. ${(it.price * it.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(212, 167, 106, 0.15); color: #B8860B; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
        Order Placed • Cash on Delivery
      </span>
      <h2 style="margin: 12px 0 6px; font-size: 22px; color: #1A1A1A;">Thank You for Your Order, ${recipientName}!</h2>
      <p style="margin: 0; color: #6B6862; font-size: 14px; line-height: 1.5;">
        We have received your order <strong>#${order.orderNumber}</strong>. Our team is verifying your items for packaging and nationwide dispatch.
      </p>
    </div>

    <div style="background: #FAFAFA; border: 1px solid #E8E5DF; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${itemsHtml}
        <tr>
          <td style="padding: 12px 0 4px; font-size: 13px; color: #8F8B82;">Subtotal</td>
          <td align="right" style="padding: 12px 0 4px; font-size: 13px; color: #1A1A1A;">Rs. ${order.subtotal?.toLocaleString()}</td>
        </tr>
        ${order.discountAmount > 0 ? `
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #B8860B;">Promotional Discount</td>
          <td align="right" style="padding: 4px 0; font-size: 13px; color: #B8860B; font-weight: 600;">-Rs. ${order.discountAmount?.toLocaleString()}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 4px 0 12px; font-size: 13px; color: #8F8B82;">Shipping Across Pakistan</td>
          <td align="right" style="padding: 4px 0 12px; font-size: 13px; color: #2E7D32; font-weight: 600;">FREE</td>
        </tr>
        <tr>
          <td style="padding: 10px 0 0; border-top: 1px solid #E8E5DF; font-size: 16px; font-weight: 700; color: #1A1A1A;">Total Due at Doorstep (COD)</td>
          <td align="right" style="padding: 10px 0 0; border-top: 1px solid #E8E5DF; font-size: 18px; font-weight: 700; color: #B8860B;">Rs. ${order.total?.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <div style="background: #FFFFFF; border: 1px solid #E8E5DF; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
      <strong style="color: #1A1A1A; display: block; margin-bottom: 4px;">Delivery Address:</strong>
      <span style="color: #6B6862;">
        ${order.shippingAddress?.fullName}<br>
        ${order.shippingAddress?.street}, ${order.shippingAddress?.city}<br>
        Phone: ${order.shippingAddress?.phone}
      </span>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="${trackingUrl}" style="display: inline-block; background-color: #1A1A1A; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em;">
        Track Your Order Live →
      </a>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Order Received: #${order.orderNumber} — Elvane Wear`,
    html: getLuxuryEmailWrapper(content),
  });
};

/**
 * 2. Email: Order Status Updated (Confirmed, Dispatched, Delivered, Cancelled)
 */
export const sendOrderStatusUpdateEmail = async (order, userEmail, newStatus) => {
  const recipientEmail = userEmail || order.shippingAddress?.email;
  const clientUrl = process.env.CLIENT_URL || 'https://elvanewears.com';
  const trackingUrl = `${clientUrl}/track?order=${order.orderNumber}`;
  const customerName = order.shippingAddress?.fullName || 'Customer';

  let statusTitle = '';
  let statusMessage = '';
  let badgeColor = '#B8860B';
  let badgeBg = 'rgba(212, 167, 106, 0.15)';

  switch (newStatus) {
    case 'Confirmed':
      statusTitle = 'Your Order Has Been Confirmed!';
      statusMessage = 'Great news! Your tracksuit set order has been verified and confirmed by our store atelier. It is now moving to tailored packaging.';
      badgeColor = '#2563EB';
      badgeBg = 'rgba(37, 99, 235, 0.12)';
      break;

    case 'Processing':
      statusTitle = 'Order is in Packaging';
      statusMessage = 'Your tracksuit is being prepared with premium packaging and quality checked before courier pickup.';
      badgeColor = '#7C3AED';
      badgeBg = 'rgba(124, 58, 237, 0.12)';
      break;

    case 'Dispatched':
      statusTitle = 'Your Order is On Its Way!';
      statusMessage = 'Your parcel has been handed over to our courier partner for nationwide delivery. Expected doorstep delivery in 2-4 business days. Please keep cash ready for payment upon arrival.';
      badgeColor = '#0284C7';
      badgeBg = 'rgba(2, 132, 199, 0.12)';
      break;

    case 'Delivered':
      statusTitle = 'Order Delivered Successfully!';
      statusMessage = 'Your Elvane Wear parcel has been marked as Delivered. We hope you love the fit, fabric, and design of your new tracksuit set! Thank you for shopping with us.';
      badgeColor = '#16A34A';
      badgeBg = 'rgba(22, 163, 74, 0.12)';
      break;

    case 'Cancelled':
      statusTitle = 'Order Update: Cancelled';
      statusMessage = 'Your order has been cancelled. If this was a mistake or you wish to re-order, please contact our support team.';
      badgeColor = '#DC2626';
      badgeBg = 'rgba(220, 38, 38, 0.12)';
      break;

    default:
      statusTitle = `Order Status: ${newStatus}`;
      statusMessage = `Your order status has been updated to ${newStatus}.`;
  }

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 14px; background: ${badgeBg}; color: ${badgeColor}; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
        Status: ${newStatus}
      </span>
      <h2 style="margin: 12px 0 6px; font-size: 22px; color: #1A1A1A;">${statusTitle}</h2>
      <p style="margin: 0; color: #6B6862; font-size: 14px; line-height: 1.6; max-width: 480px; margin: 0 auto;">
        Dear ${customerName}, ${statusMessage}
      </p>
    </div>

    <div style="background: #FAFAFA; border: 1px solid #E8E5DF; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
        <tr>
          <td style="color: #8F8B82; padding: 6px 0;">Order Reference:</td>
          <td align="right" style="font-weight: 600; color: #1A1A1A; font-family: monospace;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #8F8B82; padding: 6px 0;">Total Amount (COD):</td>
          <td align="right" style="font-weight: 700; color: #B8860B; font-size: 15px;">Rs. ${order.total?.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="color: #8F8B82; padding: 6px 0;">Delivery City:</td>
          <td align="right" style="color: #1A1A1A;">${order.shippingAddress?.city || 'Pakistan'}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${trackingUrl}" style="display: inline-block; background-color: #1A1A1A; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em;">
        View Live Tracking Timeline →
      </a>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Order #${order.orderNumber} ${newStatus}: ${statusTitle} — Elvane Wear`,
    html: getLuxuryEmailWrapper(content),
  });
};

export default sendEmail;

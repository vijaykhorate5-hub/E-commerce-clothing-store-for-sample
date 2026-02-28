const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const sendOrderConfirmation = async (order, shippingEmail) => {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; color: #ccc; font-size: 13px;">${item.name}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; color: #ccc; font-size: 13px; text-align:center;">×${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; color: #c9a84c; font-size: 13px; text-align:right;">$${item.price}</td>
    </tr>
  `).join('')

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

      <!-- Header -->
      <div style="text-align:center;border-bottom:1px solid #1a1a1a;padding-bottom:30px;margin-bottom:30px;">
        <h1 style="color:#fff;font-size:22px;letter-spacing:8px;font-weight:300;margin:0;">MAISON NOIR</h1>
        <p style="color:#c9a84c;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:8px 0 0;">Order Confirmation</p>
      </div>

      <!-- Message -->
      <p style="color:#999;font-size:14px;line-height:1.8;margin-bottom:8px;">Your order has been received and is being processed.</p>
      <p style="color:#c9a84c;font-size:13px;letter-spacing:2px;margin-bottom:30px;">ORDER ID: ${order.id}</p>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#555;padding-bottom:10px;">Item</th>
            <th style="text-align:center;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#555;padding-bottom:10px;">Qty</th>
            <th style="text-align:right;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#555;padding-bottom:10px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Total -->
      <div style="text-align:right;border-top:1px solid #1a1a1a;padding-top:16px;margin-bottom:30px;">
        <span style="color:#999;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-right:16px;">Total</span>
        <span style="color:#c9a84c;font-size:18px;font-weight:300;">$${order.total}</span>
      </div>

      <!-- Shipping -->
      <div style="background:#111;padding:20px;margin-bottom:30px;">
        <p style="color:#555;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">Shipping To</p>
        <p style="color:#ccc;font-size:13px;margin:0;line-height:1.8;">
          ${order.shipping.firstName} ${order.shipping.lastName}<br/>
          ${order.shipping.address}<br/>
          ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}<br/>
          ${order.shipping.country}
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align:center;border-top:1px solid #1a1a1a;padding-top:24px;">
        <p style="color:#444;font-size:11px;letter-spacing:2px;margin:0;">Thank you for choosing Maison Noir.</p>
      </div>

    </div>
  </body>
  </html>
  `

  await transporter.sendMail({
    from: `"Maison Noir" <${process.env.EMAIL_USER}>`,
    to: shippingEmail,
    subject: `Order Confirmed — ${order.id} | MAISON NOIR`,
    html
  })
}

module.exports = { sendOrderConfirmation }
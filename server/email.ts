// AirFiltersDirect — Email Service
// Uses Nodemailer with SMTP2GO (mail.smtp2go.com:587)
// Sends: (1) owner order notification, (2) customer order confirmation

import nodemailer from 'nodemailer';

// ─── SMTP2GO Transporter ───────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP2GO_USER || 'afdform',
    pass: process.env.SMTP2GO_PASS || '',
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface OrderEmailPayload {
  orderId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  payment: 'etransfer' | 'card_cash';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    packageNote?: string;
  }>;
  subtotal: number;
  hst: number;
  delivery: number;
  total: number;
}

// ─── Shared HTML Helpers ───────────────────────────────────────────────────────

function buildItemRows(items: OrderEmailPayload['items']): string {
  return items
    .map(
      item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#1e293b;">
          ${item.name}${item.packageNote ? ` <span style="color:#64748b;font-size:12px;">(${item.packageNote})</span>` : ''}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#1e293b;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;color:#1e293b;">$${item.price.toFixed(2)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#1e293b;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');
}

function buildTotalsBlock(data: OrderEmailPayload): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#64748b;">Subtotal</td>
        <td style="padding:6px 0;font-size:13px;color:#64748b;text-align:right;">$${data.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#64748b;">HST (13%)</td>
        <td style="padding:6px 0;font-size:13px;color:#64748b;text-align:right;">$${data.hst.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#64748b;">Delivery</td>
        <td style="padding:6px 0;font-size:13px;color:#64748b;text-align:right;">$${data.delivery.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0 0;font-size:16px;font-weight:800;color:#1e293b;border-top:2px solid #e2e8f0;">Total Due</td>
        <td style="padding:10px 0 0;font-size:16px;font-weight:800;color:#0369a1;text-align:right;border-top:2px solid #e2e8f0;">$${data.total.toFixed(2)} CAD</td>
      </tr>
    </table>`;
}

// ─── Owner Notification Email ──────────────────────────────────────────────────

function buildOwnerEmailHtml(data: OrderEmailPayload): string {
  const paymentLabel =
    data.payment === 'etransfer' ? 'E-Transfer' : 'Credit Card or Cash at Door';

  const etransferBlock =
    data.payment === 'etransfer'
      ? `
      <div style="margin-top:24px;padding:16px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px;">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8;font-size:14px;">⚡ E-Transfer Required</p>
        <p style="margin:0 0 4px;color:#1e40af;font-size:14px;">
          Send <strong>$${data.total.toFixed(2)} CAD</strong> to <strong>payments@airfiltersdirect.ca</strong>
        </p>
        <p style="margin:0;color:#1e40af;font-size:14px;">
          Memo / message field: <strong style="font-family:monospace;letter-spacing:0.1em;">${data.orderId}</strong>
        </p>
      </div>`
      : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New Order — ${data.orderId}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9,#0369a1);padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🛒 New Order Received</p>
              <p style="margin:6px 0 0;font-size:13px;color:#bae6fd;">AirFiltersDirect</p>
            </td>
          </tr>
          <tr>
            <td style="background:#0f172a;padding:14px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Order Reference</p>
              <p style="margin:4px 0 0;font-family:monospace;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:0.15em;">${data.orderId}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;font-size:15px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Customer Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <tr><td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;width:140px;font-size:13px;font-weight:600;color:#64748b;">Name</td><td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${data.fullName}</td></tr>
                <tr><td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#64748b;">Phone</td><td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${data.phone}</td></tr>
                <tr><td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#64748b;">Email</td><td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${data.email}</td></tr>
                <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;">Delivery Address</td><td style="padding:10px 16px;font-size:13px;color:#1e293b;">${data.address}, ${data.city}, ${data.province} ${data.postalCode}</td></tr>
              </table>
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Payment Method</h2>
              <p style="margin:0 0 28px;font-size:14px;color:#1e293b;background:#f8fafc;padding:12px 16px;border-radius:8px;">
                ${data.payment === 'etransfer' ? '💳 E-Transfer' : '💵 Credit Card or Cash at Door'}
              </p>
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Order Items</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:16px;">
                <thead>
                  <tr style="background:#f0f9ff;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Unit</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Line</th>
                  </tr>
                </thead>
                <tbody>${buildItemRows(data.items)}</tbody>
              </table>
              ${buildTotalsBlock(data)}
              ${etransferBlock}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                AirFiltersDirect · support@airfiltersdirect.ca · Order placed ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Customer Confirmation Email ───────────────────────────────────────────────

function buildCustomerEmailHtml(data: OrderEmailPayload): string {
  const etransferBlock =
    data.payment === 'etransfer'
      ? `
      <div style="margin-top:24px;padding:20px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:8px;">
        <p style="margin:0 0 10px;font-weight:700;color:#1d4ed8;font-size:15px;">⚡ E-Transfer Payment Instructions</p>
        <p style="margin:0 0 6px;color:#1e40af;font-size:14px;">
          Please send <strong>$${data.total.toFixed(2)} CAD</strong> to <strong>payments@airfiltersdirect.ca</strong>
        </p>
        <p style="margin:0 0 6px;color:#1e40af;font-size:14px;">
          In the memo / message field, enter your order reference:
        </p>
        <p style="margin:0;font-family:monospace;font-size:20px;font-weight:800;color:#1d4ed8;letter-spacing:0.15em;text-align:center;padding:10px;background:#dbeafe;border-radius:6px;">${data.orderId}</p>
      </div>`
      : `
      <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-left:4px solid #22c55e;border-radius:8px;">
        <p style="margin:0;color:#166534;font-size:14px;">💵 <strong>Credit Card or Cash at Door</strong> — payment will be collected upon delivery.</p>
      </div>`;

  const firstName = data.fullName.split(' ')[0];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your AirFiltersDirect Order — ${data.orderId}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9,#0369a1);padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">✅ Order Confirmed!</p>
              <p style="margin:6px 0 0;font-size:13px;color:#bae6fd;">AirFiltersDirect — Thank you, ${firstName}!</p>
            </td>
          </tr>

          <!-- Order ID Banner -->
          <tr>
            <td style="background:#0f172a;padding:14px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Your Order Reference</p>
              <p style="margin:4px 0 0;font-family:monospace;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:0.15em;">${data.orderId}</p>
              <p style="margin:6px 0 0;font-size:12px;color:#64748b;">Quote this reference when contacting us about your order</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <!-- What's next -->
              <div style="background:#f0f9ff;border-radius:8px;padding:16px 20px;margin-bottom:28px;border:1px solid #bae6fd;">
                <p style="margin:0 0 6px;font-weight:700;color:#0369a1;font-size:14px;">📦 What happens next?</p>
                <p style="margin:0;font-size:13px;color:#1e293b;line-height:1.6;">
                  Someone from our team will be in touch to confirm your expected delivery date and time.
                  We'll reach you at <strong>${data.phone}</strong> or <strong>${data.email}</strong>.
                </p>
              </div>

              <!-- Delivery Address -->
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Delivery Address</h2>
              <p style="margin:0 0 28px;font-size:14px;color:#1e293b;background:#f8fafc;padding:12px 16px;border-radius:8px;">
                ${data.address}, ${data.city}, ${data.province} ${data.postalCode}
              </p>

              <!-- Order Items -->
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Order Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:16px;">
                <thead>
                  <tr style="background:#f0f9ff;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Unit</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;">Line</th>
                  </tr>
                </thead>
                <tbody>${buildItemRows(data.items)}</tbody>
              </table>

              ${buildTotalsBlock(data)}
              ${etransferBlock}

              <!-- Print hint -->
              <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;">
                You can print or save this email as a PDF for your records.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Questions? Contact us at <a href="mailto:support@airfiltersdirect.ca" style="color:#0369a1;">support@airfiltersdirect.ca</a> or call <a href="tel:+12894402679" style="color:#0369a1;">+1 289-440-2679</a>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;text-align:center;">
                AirFiltersDirect · Order placed ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Exported Send Function ────────────────────────────────────────────────────

export async function sendOrderEmail(data: OrderEmailPayload): Promise<void> {
  const productNames = data.items.map(i => i.name).join(', ');
  const firstName = data.fullName.split(' ')[0];

  // Send owner notification
  await transporter.sendMail({
    from: `"AirFiltersDirect" <order@airfiltersdirect.ca>`,
    to: 'orders@airfiltersdirect.ca',
    replyTo: data.email,
    subject: `${firstName} has ordered ${productNames}`,
    html: buildOwnerEmailHtml(data),
  });

  // Send customer confirmation (non-fatal if it fails)
  try {
    await transporter.sendMail({
      from: `"AirFiltersDirect" <order@airfiltersdirect.ca>`,
      to: data.email,
      subject: `Your AirFiltersDirect Order Confirmation — ${data.orderId}`,
      html: buildCustomerEmailHtml(data),
    });
  } catch (err) {
    console.warn('[Email] Customer confirmation failed (non-fatal):', err);
  }
}

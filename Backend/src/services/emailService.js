const { sendMail } = require('../config/email');

/**
 * Send auto-reply email to customer confirming receipt of inquiry
 * @param {Object} inquiry - Inquiry model instance
 * @param {Array} items - Optional array of InquiryItem instances
 */
const sendAutoReplyToCustomer = async (inquiry, items = []) => {
  const isBasket = inquiry.source === 'inquiry_basket';

  let itemsHtml = '';
  if (isBasket && items && items.length > 0) {
    itemsHtml = `
      <div style="margin-top: 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 12px 16px; color: #475569; font-size: 14px;">Product</th>
              <th style="padding: 12px 16px; color: #475569; font-size: 14px;">Specifications</th>
              <th style="padding: 12px 16px; color: #475569; font-size: 14px;">Quantity / Unit</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-weight: bold; color: #1e293b;">${item.product_name_snapshot || 'Seafood Product'}</td>
                <td style="padding: 12px 16px; color: #64748b; font-size: 13px;">${item.specifications || '-'}</td>
                <td style="padding: 12px 16px; color: #334155;">${item.quantity ? `${item.quantity} MT / Cartons` : 'As agreed'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (!isBasket && inquiry.interested_species && Array.isArray(inquiry.interested_species)) {
    itemsHtml = `
      <div style="margin-top: 15px; padding: 12px 16px; background-color: #f8fafc; border-radius: 6px;">
        <strong>Interested Products / Species:</strong>
        <p style="margin: 5px 0 0 0; color: #334155;">${inquiry.interested_species.join(', ')}</p>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Your Inquiry - Golden Seafood</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 30px;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">GOLDEN SEAFOOD CO., LTD</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #93c5fd;">Premium Vietnamese Seafood Processor & Exporter</p>
        </div>

        <!-- Body -->
        <div style="padding: 35px;">
          <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Dear <strong>${inquiry.full_name}</strong>,</p>
          
          <p style="color: #475569; line-height: 1.6;">
            Thank you for reaching out to <strong>Golden Seafood Co., Ltd</strong>. We have successfully received your inquiry (Code: <strong style="color: #1d4ed8;">${inquiry.inquiry_code}</strong>).
          </p>
          
          <p style="color: #475569; line-height: 1.6;">
            Our dedicated export sales team is currently reviewing your requirements and will prepare a customized quotation/proposal for your company (<strong>${inquiry.company_name}</strong>) within <strong>24 working hours</strong>.
          </p>

          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 25px 0; border-radius: 0 6px 6px 0;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 15px;">Inquiry Summary (${inquiry.inquiry_code})</h4>
            <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Company:</strong> ${inquiry.company_name} (${inquiry.country})</p>
            <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Email:</strong> ${inquiry.email}</p>
            ${inquiry.whatsapp_number ? `<p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>WhatsApp/Phone:</strong> ${inquiry.whatsapp_number}</p>` : ''}
            ${inquiry.destination_port ? `<p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Destination Port:</strong> ${inquiry.destination_port}</p>` : ''}
            ${inquiry.message ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #475569; font-style: italic;">"${inquiry.message}"</p>` : ''}
          </div>

          ${itemsHtml}

          <p style="color: #475569; line-height: 1.6; margin-top: 25px;">
            If you need immediate assistance or would like to speak directly with our sales directors via WhatsApp/WeChat, please contact us anytime.
          </p>

          <!-- Contact Buttons -->
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '84945950099'}" style="display: inline-block; background-color: #25d366; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-right: 10px;">💬 Chat on WhatsApp</a>
            <a href="mailto:info@goldenseafood.com.vn" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px;">📧 Email Us</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 25px; text-align: center; color: #64748b; font-size: 13px;">
          <p style="margin: 0; font-weight: bold; color: #334155;">Golden Seafood Co., Ltd - Headquarters & Factory</p>
          <p style="margin: 5px 0;">Lot 12, Industrial Zone, Mekong Delta, Vietnam</p>
          <p style="margin: 5px 0;">Email: info@goldenseafood.com.vn | Web: www.goldenseafood.com.vn</p>
          <p style="margin: 15px 0 0 0; font-size: 11px; color: #94a3b8;">© ${new Date().getFullYear()} Golden Seafood Co., Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(inquiry.email, `[${inquiry.inquiry_code}] Thank You for Your Seafood Inquiry - Golden Seafood`, html);
};

/**
 * Send notification email to sales team (binh@goldenseafood.com.vn & CC: tram@goldenseafood.com.vn)
 * @param {Object} inquiry - Inquiry model instance
 * @param {Array} items - Optional array of InquiryItem instances
 */
const sendNotificationToSalesTeam = async (inquiry, items = []) => {
  const isBasket = inquiry.source === 'inquiry_basket';
  const toEmail = process.env.NOTIFY_EMAIL || 'binh@goldenseafood.com.vn';
  const ccEmail = process.env.NOTIFY_EMAIL_CC || 'tram@goldenseafood.com.vn';

  let itemsHtml = '';
  if (isBasket && items && items.length > 0) {
    itemsHtml = `
      <h3 style="color: #1e3a8a; margin-top: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">📦 Inquiry Basket Items (${items.length})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 10px; text-align: left; font-size: 13px;">#</th>
            <th style="padding: 10px; text-align: left; font-size: 13px;">Product</th>
            <th style="padding: 10px; text-align: left; font-size: 13px;">Specs / Notes</th>
            <th style="padding: 10px; text-align: left; font-size: 13px;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, idx) => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-size: 13px; color: #64748b;">${idx + 1}</td>
              <td style="padding: 10px; font-weight: bold; color: #0f172a;">${item.product_name_snapshot}</td>
              <td style="padding: 10px; font-size: 13px; color: #334155;">
                ${item.specifications ? `<div><strong>Specs:</strong> ${item.specifications}</div>` : ''}
                ${item.notes ? `<div style="color: #64748b; font-style: italic;">"${item.notes}"</div>` : ''}
              </td>
              <td style="padding: 10px; font-weight: bold; color: #1d4ed8;">${item.quantity || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (!isBasket && inquiry.interested_species && Array.isArray(inquiry.interested_species)) {
    itemsHtml = `
      <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
        <strong style="color: #92400e;">🦐 Interested Products / Species (Contact Form):</strong>
        <p style="margin: 6px 0 0 0; color: #78350f; font-weight: bold;">${inquiry.interested_species.join(', ')}</p>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Inquiry Notification - ${inquiry.inquiry_code}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 25px;">
      <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #dc2626; padding: 20px 25px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; font-size: 20px;">🔥 NEW B2B INQUIRY RECEIVED</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #fecaca;">Source: ${isBasket ? 'Inquiry Basket Request' : 'Quick Contact Form'}</p>
          </div>
          <div style="background-color: #ffffff; color: #dc2626; font-weight: bold; padding: 6px 12px; border-radius: 4px; font-size: 15px;">
            ${inquiry.inquiry_code}
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 25px;">
          <h3 style="color: #1e3a8a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">👤 Buyer & Company Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; width: 35%; color: #64748b; font-weight: bold;">Full Name:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold; font-size: 15px;">${inquiry.full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Job Title / Designation:</td>
              <td style="padding: 10px 0; color: #334155;">${inquiry.job_title || '-'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Company Name:</td>
              <td style="padding: 10px 0; color: #1d4ed8; font-weight: bold; font-size: 16px;">${inquiry.company_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Country / Region:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">🌍 ${inquiry.country}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email Address:</td>
              <td style="padding: 10px 0;"><a href="mailto:${inquiry.email}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${inquiry.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">WhatsApp / Mobile:</td>
              <td style="padding: 10px 0; color: #0f172a;">
                ${inquiry.whatsapp_number ? `<a href="https://wa.me/${inquiry.whatsapp_number.replace(/[^0-9]/g, '')}" style="color: #16a34a; font-weight: bold; text-decoration: none;">💬 ${inquiry.whatsapp_number} (Click to Chat)</a>` : '-'}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Destination Port:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">🚢 ${inquiry.destination_port || 'Not specified'}</td>
            </tr>
            ${inquiry.attachment_url ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Attachment Sheet:</td>
              <td style="padding: 10px 0;"><a href="http://localhost:3000/${inquiry.attachment_url}" target="_blank" style="color: #dc2626; font-weight: bold;">📎 View Attached File</a></td>
            </tr>
            ` : ''}
          </table>

          <h3 style="color: #1e3a8a; margin-top: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">📝 Buyer Message & Special Requirements</h3>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; color: #334155; line-height: 1.5;"><strong>General Message:</strong><br>${inquiry.message ? inquiry.message.replace(/\n/g, '<br>') : '<em>No message attached</em>'}</p>
            ${inquiry.special_requirements ? `<p style="margin: 10px 0 0 0; color: #991b1b; line-height: 1.5; border-top: 1px dashed #cbd5e1; padding-top: 10px;"><strong>⚠️ Special Requirements (Quality / Packaging / Specs):</strong><br>${inquiry.special_requirements.replace(/\n/g, '<br>')}</p>` : ''}
          </div>

          ${itemsHtml}

          <!-- Admin CTA -->
          <div style="margin-top: 30px; text-align: center; background-color: #f1f5f9; padding: 20px; border-radius: 6px;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">Please review this inquiry in the Golden Seafood Admin Portal and assign a sales executive:</p>
            <a href="http://localhost:3000/admin" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: bold; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px;">⚡ Open Admin Dashboard</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(toEmail, `🔥 [${inquiry.inquiry_code}] New B2B Inquiry from ${inquiry.company_name} (${inquiry.country})`, html, {
    cc: ccEmail,
  });
};

module.exports = {
  sendAutoReplyToCustomer,
  sendNotificationToSalesTeam,
};

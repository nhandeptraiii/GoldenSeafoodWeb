const { sequelize, Inquiry, InquiryItem, Product } = require('../models');
const { generateInquiryCode } = require('../utils/inquiryCode');
const emailService = require('./emailService');

/**
 * Process and save contact form inquiry (source: contact_form)
 */
const createContactInquiry = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const inquiry_code = await generateInquiryCode();

    const inquiry = await Inquiry.create(
      {
        inquiry_code,
        full_name: data.full_name,
        job_title: data.job_title || null,
        company_name: data.company_name,
        country: data.country,
        email: data.email,
        whatsapp_number: data.whatsapp_number || null,
        destination_port: data.destination_port || null,
        message: data.message || null,
        special_requirements: data.special_requirements || null,
        attachment_url: data.attachment_url || null,
        source: 'contact_form',
        status: 'new',
        interested_species: data.interested_species || [],
        auto_reply_sent: false,
      },
      { transaction }
    );

    await transaction.commit();

    // Trigger emails asynchronously without blocking response
    setImmediate(async () => {
      try {
        await emailService.sendAutoReplyToCustomer(inquiry);
        await emailService.sendNotificationToSalesTeam(inquiry);
        await inquiry.update({ auto_reply_sent: true });
        console.log(`✅ Emails sent for inquiry: ${inquiry_code}`);
      } catch (err) {
        console.error(`❌ Error sending emails for inquiry ${inquiry_code}:`, err.message);
      }
    });

    return inquiry;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Process and save inquiry basket submission (source: inquiry_basket) with items
 */
const createBasketInquiry = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const inquiry_code = await generateInquiryCode();

    const inquiry = await Inquiry.create(
      {
        inquiry_code,
        full_name: data.full_name,
        job_title: data.job_title || null,
        company_name: data.company_name,
        country: data.country,
        email: data.email,
        whatsapp_number: data.whatsapp_number || null,
        destination_port: data.destination_port || null,
        message: data.message || null,
        special_requirements: data.special_requirements || null,
        attachment_url: data.attachment_url || null,
        source: 'inquiry_basket',
        status: 'new',
        auto_reply_sent: false,
      },
      { transaction }
    );

    // Process and save basket items
    const itemsData = [];
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
      for (const item of data.items) {
        let productNameSnapshot = item.product_name || 'Seafood Product';

        // Check if product exists in DB to grab canonical name if available
        if (item.product_id) {
          const product = await Product.findByPk(item.product_id, { transaction });
          if (product) {
            productNameSnapshot = product.name_en;
          }
        }

        itemsData.push({
          inquiry_id: inquiry.id,
          product_id: item.product_id || null,
          product_name_snapshot: productNameSnapshot,
          specifications: item.specifications || null,
          quantity: item.quantity ? parseInt(item.quantity, 10) : null,
          notes: item.notes || null,
        });
      }

      await InquiryItem.bulkCreate(itemsData, { transaction });
    }

    await transaction.commit();

    // Fetch full inquiry with items for email sending
    const fullInquiry = await Inquiry.findByPk(inquiry.id, {
      include: [{ model: InquiryItem, as: 'items' }],
    });

    // Trigger emails asynchronously without blocking response
    setImmediate(async () => {
      try {
        await emailService.sendAutoReplyToCustomer(fullInquiry, fullInquiry.items);
        await emailService.sendNotificationToSalesTeam(fullInquiry, fullInquiry.items);
        await fullInquiry.update({ auto_reply_sent: true });
        console.log(`✅ Emails sent for basket inquiry: ${inquiry_code}`);
      } catch (err) {
        console.error(`❌ Error sending emails for basket inquiry ${inquiry_code}:`, err.message);
      }
    });

    return fullInquiry;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createContactInquiry,
  createBasketInquiry,
};

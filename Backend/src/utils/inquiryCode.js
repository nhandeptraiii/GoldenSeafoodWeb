const { Inquiry } = require('../models');
const { Op } = require('sequelize');

/**
 * Generate unique inquiry code format: GS-YYYYMMDD-XXX
 * e.g., GS-20260716-001
 */
const generateInquiryCode = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const prefix = `GS-${dateStr}-`;

  // Find highest counter for today
  const lastInquiry = await Inquiry.findOne({
    where: {
      inquiry_code: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['id', 'DESC']],
  });

  let counter = 1;
  if (lastInquiry && lastInquiry.inquiry_code) {
    const lastNumStr = lastInquiry.inquiry_code.split('-').pop();
    const lastNum = parseInt(lastNumStr, 10);
    if (!isNaN(lastNum)) {
      counter = lastNum + 1;
    }
  }

  const counterStr = String(counter).padStart(3, '0');
  return `${prefix}${counterStr}`;
};

module.exports = { generateInquiryCode };

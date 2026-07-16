const { Inquiry, InquiryItem, sequelize } = require('../models');
const { getPagination } = require('../utils/pagination');
const { body } = require('express-validator');

const validateStatusUpdate = [
  body('status')
    .isIn(['new', 'processing', 'quoted', 'closed'])
    .withMessage('Invalid status value. Must be new, processing, quoted, or closed'),
];

/**
 * @route GET /api/admin/inquiries
 * @desc Get paginated list of inquiries with filtering by status, source, and search
 */
const getAllInquiries = async (req, res, next) => {
  try {
    const whereClause = {};

    if (req.query.status && ['new', 'processing', 'quoted', 'closed'].includes(req.query.status)) {
      whereClause.status = req.query.status;
    }

    if (req.query.source && ['contact_form', 'inquiry_basket'].includes(req.query.source)) {
      whereClause.source = req.query.source;
    }

    if (req.query.search && req.query.search.trim() !== '') {
      const searchTerm = `%${req.query.search.trim()}%`;
      whereClause[sequelize.Sequelize.Op.or] = [
        { inquiry_code: { [sequelize.Sequelize.Op.like]: searchTerm } },
        { full_name: { [sequelize.Sequelize.Op.like]: searchTerm } },
        { company_name: { [sequelize.Sequelize.Op.like]: searchTerm } },
        { email: { [sequelize.Sequelize.Op.like]: searchTerm } },
        { country: { [sequelize.Sequelize.Op.like]: searchTerm } },
      ];
    }

    const totalCount = await Inquiry.count({ where: whereClause });
    const { limit, offset, pagination } = getPagination(req.query, totalCount);

    const inquiries = await Inquiry.findAll({
      where: whereClause,
      include: [
        {
          model: InquiryItem,
          as: 'items',
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        inquiries,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/admin/inquiries/:id
 * @desc Get full details of a specific inquiry by id
 */
const getInquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByPk(id, {
      include: [
        {
          model: InquiryItem,
          as: 'items',
        },
      ],
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/admin/inquiries/:id/status
 * @desc Update inquiry status workflow (new -> processing -> quoted -> closed)
 */
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    await inquiry.update({ status });

    res.json({
      success: true,
      message: `Inquiry status updated to '${status}' successfully`,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/admin/inquiries/:id
 * @desc Delete an inquiry record
 */
const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    await inquiry.destroy();

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateStatusUpdate,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};

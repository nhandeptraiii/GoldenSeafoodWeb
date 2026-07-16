const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../config/jwt');
const { body } = require('express-validator');

/**
 * Validation rules for admin login
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * @route POST /api/admin/login
 * @desc Admin user login, returns JWT token and profile
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username: username.trim(),
      },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Update last_login timestamp
    await user.update({ last_login: new Date() });

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = generateToken(payload);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          last_login: user.last_login,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/admin/me
 * @desc Get currently authenticated admin profile
 * @access Private/Admin
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'full_name', 'role', 'last_login', 'created_at'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateLogin,
  login,
  getMe,
};

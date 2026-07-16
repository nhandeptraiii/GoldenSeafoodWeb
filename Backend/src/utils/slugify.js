const slugifyLibrary = require('slugify');

/**
 * Generate a clean SEO-friendly slug from string
 * @param {string} text - Input text
 * @returns {string} Slugified string
 */
const slugify = (text) => {
  if (!text) return '';
  return slugifyLibrary(text, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: /[*+~.()'"!:@/#?]/g, // remove characters that match regex, defaults to `undefined`
    lower: true,       // convert to lower case, defaults to `false`
    strict: true,      // strip special characters except replacement, defaults to `false`
    locale: 'vi',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  });
};

/**
 * Generate a unique slug checking against a Sequelize model
 * @param {Object} Model - Sequelize Model
 * @param {string} text - Input text to slugify
 * @param {number|null} excludeId - ID to exclude when checking duplicates (for updates)
 * @returns {Promise<string>} Unique slug
 */
const generateUniqueSlug = async (Model, text, excludeId = null) => {
  const baseSlug = slugify(text);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const whereClause = { slug: uniqueSlug };
    if (excludeId) {
      whereClause.id = { [Model.sequelize.Sequelize.Op.ne]: excludeId };
    }

    const existing = await Model.findOne({ where: whereClause });
    if (!existing) {
      break;
    }
    counter += 1;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

module.exports = { slugify, generateUniqueSlug };

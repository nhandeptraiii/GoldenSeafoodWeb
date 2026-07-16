/**
 * Pagination helper
 * @param {Object} query - Express req.query
 * @param {number} totalCount - Total records found
 * @returns {Object} { page, limit, offset, pagination: { page, limit, total, totalPages } }
 */
const getPagination = (query, totalCount = 0) => {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 9;

  // Validate page and limit bounds
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 50) limit = 50; // Max 50 items per page

  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    page,
    limit,
    offset,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
    },
  };
};

module.exports = { getPagination };

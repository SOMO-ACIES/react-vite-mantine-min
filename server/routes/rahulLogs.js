const express = require('express');
const { query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { getRahulLogs } = require('../services/rahulLogsService');

const router = express.Router();

/**
 * @swagger
 * /rahulLogs:
 *   get:
 *     summary: Get Rahul agent logs
 *     tags: [RahulLogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of logs
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const logs = await getRahulLogs();
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const totalCount = logs.length;
      const paged = logs.slice((pageNum - 1) * limitNum, pageNum * limitNum);
      res.json({
        success: true,
        data: paged,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage: pageNum * limitNum < totalCount,
          hasPrevPage: pageNum > 1,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch logs' },
        timestamp: new Date().toISOString(),
      });
    }
  }
);

module.exports = router;

const insightService = require('../services/insight.service');

const getInsights = async (req, res, next) => {
  try {
    const insights = await insightService.getInsights(
      req.user.userId,
      req.query
    );
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInsights,
};

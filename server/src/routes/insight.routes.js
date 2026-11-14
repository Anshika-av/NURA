const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const insightController = require('../controllers/insight.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', insightController.getInsights);

module.exports = router;

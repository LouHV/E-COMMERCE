'use strict';

const express = require('express');

const router = express.Router();

const statisticController = require("../controllers/statisticController");
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/get-revenue-by-day/:day', [], statisticController.getRevenueByDay);

module.exports = router;

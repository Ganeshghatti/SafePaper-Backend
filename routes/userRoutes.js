const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');

// Routes that require top-admin authorization
router.post('/paper-setter', adminAuth, userController.createPaperSetter);
router.post('/guardian', adminAuth, userController.createGuardian);
router.post('/exam-center', adminAuth, userController.createExamCenter);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');

// All routes are protected by adminAuth middleware
router.use(adminAuth);

// Create user
router.post('/', userController.createUser);

// Get all users (can filter by role using query parameter)
router.get('/', userController.getAllUsers);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;

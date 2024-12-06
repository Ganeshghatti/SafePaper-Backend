const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const auth = require("../middleware/auth");

// Get all guardians (only accessible by paper setters)
router.get(
  "/guardians",
  auth,
  (req, res, next) => {
    if (req.user.role !== "paper-setter") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  },
  questionController.getAllGuardians
);

// Create questions (only paper setters)
router.post(
  "/",
  auth,
  (req, res, next) => {
    if (req.user.role !== "paper-setter") {
      return res.status(403).json({
        success: false,
        message: "Only paper setters can create questions",
      });
    }
    next();
  },
  questionController.createQuestion
);

module.exports = router;

const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const adminAuth = require("../middleware/adminAuth");

router.get("/current", adminAuth, examController.getCurrentExam);
router.post("/schedule", adminAuth, examController.scheduleExam);
router.delete("/:id", adminAuth, examController.deleteExam);

module.exports = router; 
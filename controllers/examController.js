const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const { sendExamNotification } = require('../utils/emailService');

exports.scheduleExam = async (req, res) => {
  try {
    // Check for existing active exam
    const existingExam = await Exam.findOne({ 
      status: { $in: ['scheduled', 'in-progress'] } 
    });

    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: 'An exam is already scheduled or in progress'
      });
    }

    const { date, startTime, endTime } = req.body;

    // Validate if date is in future
    const examDate = new Date(date);
    if (examDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Exam date must be in the future'
      });
    }

    // Get all guardians
    const guardians = await User.find({ role: 'guardian' });
    if (guardians.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No guardians found in the system'
      });
    }

    // Get random 100 questions
    const questions = await Question.aggregate([
      { $sample: { size: 100 } }
    ]);

    if (questions.length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Not enough questions in the system'
      });
    }

    // Create exam
    const exam = new Exam({
      date: examDate,
      startTime,
      endTime,
      guardianKeys: guardians.map(guardian => ({
        guardian: guardian._id
      })),
      selectedQuestions: questions.map(q => q._id)
    });

    await exam.save();

    // Send notifications to guardians
    for (const guardian of guardians) {
      await sendExamNotification(
        guardian.email,
        {
          date: examDate,
          startTime,
          endTime
        }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Exam scheduled successfully'
    });

  } catch (error) {
    console.error('Schedule exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling exam'
    });
  }
};

exports.getCurrentExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ status: { $in: ['scheduled', 'in-progress'] } })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error('Get current exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching current exam'
    });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    if (exam.status === 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an exam that is in progress'
      });
    }

    await exam.deleteOne();

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting exam'
    });
  }
}; 
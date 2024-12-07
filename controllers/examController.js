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

    // Get all guardians
    const guardians = await User.find({ role: 'guardian' });
    if (guardians.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No guardians found in the system'
      });
    }

    // Get random 25 questions
    const questions = await Question.aggregate([
      { $sample: { size: 25 } }
    ]);

    if (questions.length < 25) {
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

exports.submitGuardianKey = async (req, res) => {
  try {
    const { key } = req.body;

    const exam = await Exam.findOne({ 
      status: { $in: ['scheduled', 'in-progress'] },
      'guardianKeys.guardian': req.user.id
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'No active exam found'
      });
    }

    const guardianKeyIndex = exam.guardianKeys.findIndex(
      gk => gk.guardian.toString() === req.user.id.toString()
    );

    if (exam.guardianKeys[guardianKeyIndex].keySubmitted) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted your key'
      });
    }

    exam.guardianKeys[guardianKeyIndex].keySubmitted = true;
    exam.guardianKeys[guardianKeyIndex].key = key;
    exam.guardianKeys[guardianKeyIndex].submittedAt = new Date();

    await exam.save();

    res.json({
      success: true,
      message: 'Key submitted successfully'
    });

  } catch (error) {
    console.error('Submit guardian key error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting key'
    });
  }
};

exports.checkKeySubmissionStatus = async (req, res) => {
  try {
    const exam = await Exam.findOne({ 
      status: { $in: ['scheduled', 'in-progress'] },
      'guardianKeys.guardian': req.user.id
    });

    if (!exam) {
      return res.json({
        success: true,
        hasSubmitted: false,
        message: 'No active exam found'
      });
    }

    const guardianKey = exam.guardianKeys.find(
      gk => gk.guardian.toString() === req.user.id.toString()
    );

    res.json({
      success: true,
      hasSubmitted: guardianKey.keySubmitted,
      examDetails: {
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        status: exam.status
      }
    });

  } catch (error) {
    console.error('Check key submission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking key submission status'
    });
  }
};

exports.getExamCenterExamDetails = async (req, res) => {
  try {

    const exam = await Exam.findOne({ 
      status: { $in: ['scheduled', 'in-progress'] } 
    }).select('date startTime endTime status decodedQuestions');

    if (!exam) {
      return res.json({
        success: true,
        message: 'No active exam found'
      });
    }

    // Only send decoded questions if they exist
    const examResponse = {
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      status: exam.status,
      hasDecodedQuestions: exam.decodedQuestions.length > 0
    };

    if (exam.decodedQuestions.length > 0) {
      console.log(`Found ${exam.decodedQuestions.length} decoded questions`);
      examResponse.questions = exam.decodedQuestions.map(q => ({
        id: q.questionId,
        question: q.question,
        options: q.options
      }));
    }

    console.log('Sending exam response:', examResponse);

    res.json({
      success: true,
      examDetails: examResponse
    });

  } catch (error) {
    console.error('Get exam center exam details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam details'
    });
  }
};

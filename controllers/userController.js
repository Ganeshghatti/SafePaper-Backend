const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.createPaperSetter = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: 'paper-setter'
    });

    await user.save();
    res.status(201).json({ message: 'Paper setter created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createGuardian = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: 'guardian'
    });

    await user.save();
    res.status(201).json({ message: 'Guardian created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createExamCenter = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: 'exam-center'
    });

    await user.save();
    res.status(201).json({ message: 'Exam center created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

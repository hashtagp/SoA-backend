import User from "../models/userModel.js";
import Question from "../models/questionModel.js";

// Start Test - Assign 20 random questions to a user
export const startTest = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch 20 random questions
    const questions = await Question.aggregate([{ $sample: { size: 20 } }]);

    // Map to store only question IDs
    const testQuestions = questions.map(q => ({
      questionId: q._id,
      chosenAnswer: null, // Default null (not answered yet)
    }));

    // Set test data & timestamps
    user.testData = testQuestions;
    user.startTime = new Date();
    user.endTime = new Date(user.startTime.getTime() + 30 * 60 * 1000); // Example: 30 mins duration

    await user.save();

    res.status(200).json({ success: true, message: "Test started!", testData: user.testData });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Save Test Progress
export const saveTest = async (req, res) => {
  try {
    const { userId } = req.body;
    const { testData, currentDate } = req.body; // Test answers and current timestamp

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure testData exists for the user
    if (!user.testData || user.testData.length === 0) {
      return res.status(400).json({ success: false, message: "No active test found for the user." });
    }

    // Check if the test is still within the allowed time
    if (new Date(currentDate) > new Date(user.endTime)) {
      return res.status(400).json({ success: false, message: "Test submission time exceeded!" });
    }

    // Update the user's test data with chosen answers
    user.testData = user.testData.map(question => {
      const answeredQuestion = testData.find(q => q.questionId === question.questionId.toString());
      if (answeredQuestion) {
        return { ...question, chosenAnswer: answeredQuestion.chosenAnswer };
      }
      return question; // Keep existing if not updated
    });

    await user.save();
    res.status(200).json({ success: true, message: "Test saved successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Fetch Test Data
export const fetchTest = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user
    const user = await User.findById(userId).populate('testData.questionId');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure testData exists for the user
    if (!user.testData || user.testData.length === 0) {
      return res.status(400).json({ success: false, message: "No active test found for the user." });
    }

    res.status(200).json({ success: true, message: "Test data fetched successfully!", testData: user.testData });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Get Test Result
export const getTestResult = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user
    const user = await User.findById(userId).populate('testData.questionId');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure testData exists for the user
    if (!user.testData || user.testData.length === 0) {
      return res.status(400).json({ success: false, message: "No active test found for the user." });
    }

    // Calculate the number of correct answers
    let correctAnswers = 0;
    user.testData.forEach(question => {
      if (question.chosenAnswer === question.questionId.answer) {
        correctAnswers++;
      }
    });

    res.status(200).json({ success: true, message: "Test result calculated successfully!", correctAnswers, totalQuestions: user.testData.length });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
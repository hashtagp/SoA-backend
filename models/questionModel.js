import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of 4 option strings
    required: true,
    validate: {
      validator: function (val) {
        return val.length === 4; // Ensures exactly 4 options
      },
      message: "There must be exactly 4 options.",
    },
  },
  answer: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return this.options.includes(val); // Ensures answer is one of the options
      },
      message: "Answer must be one of the options.",
    },
  },
  marks: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // Store image URL or base64 string
    required: false, // Optional field
  },
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;

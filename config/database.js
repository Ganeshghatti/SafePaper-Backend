const mongoose = require("mongoose");

const connectdatabase = async () => {
  try {
    // this is db from aniket mongodb account
    await mongoose.connect(
      "mongodb+srv://ganesh:12@aidcircle.uvee4.mongodb.net/?retryWrites=true&w=majority&appName=aidcircle"
    );

    console.log("db connection successful");
  } catch (error) {
    console.log("db connection failed" + error.message);
  }
};
module.exports = connectdatabase;
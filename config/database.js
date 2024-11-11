const mongoose = require("mongoose");

const connectdatabase = async () => {
  try {
    // this is db from aniket mongodb account
    await mongoose.connect(
      "mongodb+srv://ganeshghatti6:vH5QoAtQNMsIrjjG@safepaper.8x5px.mongodb.net/?retryWrites=true&w=majority&appName=SafePaper"
    );

    console.log("db connection successful");
  } catch (error) {
    console.log("db connection failed" + error.message);
  }
};
module.exports = connectdatabase;

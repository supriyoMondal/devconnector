const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

//mongoose.connect(db,{useNewUrlParser: true})

const connectDB = async () => {
  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB connected ...");
  } catch (err) {
    console.log(err.message);
    //Exit the process with faliure
    process.exit(1);
  }
};

module.exports = connectDB;

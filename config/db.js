const mongoose = require('mongoose');
const config = require('config');

const configDB = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(configDB, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('Connected to mongoDB...');
  } catch (error) {
    console.log(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

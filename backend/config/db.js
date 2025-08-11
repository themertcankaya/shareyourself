const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB bağlantısı başarılı host: ${conn.connection.host}`);
    console.log(`MongoDB bağlantısı başarılı name: ${conn.connection.name}`);
    console.log(
      `MongoDB bağlantısı başarılı readyState: ${conn.connection.readyState}`
    );
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

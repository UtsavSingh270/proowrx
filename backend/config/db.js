const mongoose = require("mongoose");
const dns = require("dns");

// Force Node to use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  try {
    console.log("Mongo URI:", uri);

    // Test SRV resolution first
    const records = await dns.promises.resolveSrv(
      "_mongodb._tcp.cluster0.ivbkhlo.mongodb.net"
    );
    console.log("SRV Records:", records);

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;
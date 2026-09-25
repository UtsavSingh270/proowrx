const mongoose = require('mongoose');
const dns = require('node:dns');
// Preserve the existing deployment's SRV resolver defaults; an empty value uses system DNS.
const dnsServers = (process.env.DNS_SERVERS ?? '1.1.1.1,8.8.8.8').split(',').map(value => value.trim()).filter(Boolean);
if (dnsServers.length) dns.setServers(dnsServers);
const connection = globalThis.__proowrxMongo || (globalThis.__proowrxMongo = { promise: null });
async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (!connection.promise) {
    connection.promise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .catch(error => { connection.promise = null; throw error; });
  }
  return connection.promise;
}
module.exports = connectDB;

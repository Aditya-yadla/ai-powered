const mongoose = require('mongoose');
const dns = require('node:dns');
const fs = require('node:fs');
const path = require('node:path');

const resolveMongoSrv = async (mongoURI) => {
  if (!mongoURI.startsWith('mongodb+srv://')) {
    return;
  }

  const srvHost = `_mongodb._tcp.${new URL(mongoURI).hostname}`;

  try {
    await dns.promises.resolveSrv(srvHost);
  } catch (error) {
    const systemServers = dns.getServers();
    dns.setServers(['1.1.1.1', '8.8.8.8']);

    try {
      await dns.promises.resolveSrv(srvHost);
    } catch (retryError) {
      dns.setServers(systemServers);
      throw retryError;
    }
  }
};

const memoryStorePath = path.join(__dirname, '../data/inMemoryStore.json');
const defaultMemoryStore = {
  isFallback: false,
  users: [],
  notes: [],
  aiResults: []
};

const ensureMemoryStoreFile = () => {
  const dir = path.dirname(memoryStorePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(memoryStorePath)) {
    fs.writeFileSync(memoryStorePath, JSON.stringify(defaultMemoryStore, null, 2));
  }
};

const loadInMemoryStore = () => {
  ensureMemoryStoreFile();

  try {
    const saved = JSON.parse(fs.readFileSync(memoryStorePath, 'utf8'));
    return {
      isFallback: true,
      users: Array.isArray(saved.users) ? saved.users : [],
      notes: Array.isArray(saved.notes) ? saved.notes : [],
      aiResults: Array.isArray(saved.aiResults) ? saved.aiResults : []
    };
  } catch (error) {
    return { ...defaultMemoryStore, isFallback: true };
  }
};

const saveInMemoryStore = () => {
  ensureMemoryStoreFile();
  const safeStore = {
    isFallback: true,
    users: inMemoryStore.users || [],
    notes: inMemoryStore.notes || [],
    aiResults: inMemoryStore.aiResults || []
  };
  fs.writeFileSync(memoryStorePath, JSON.stringify(safeStore, null, 2));
};

// In-Memory Fallback Storage to ensure zero-downtime demo execution without external MongoDB setup
const inMemoryStore = loadInMemoryStore();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI || mongoURI.includes('cluster0.mongodb.net/ai_student_notes')) {
    // Try standard mongoose connection with short timeout, fallback gracefully if unconfigured
  }

  try {
    if (!process.env.MONGO_URI) {
      console.log('⚠️  MONGO_URI not specified. Using resilient in-memory database store for demo.');
      inMemoryStore.isFallback = true;
      saveInMemoryStore();
      return;
    }
    await resolveMongoSrv(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`⚠️  MongoDB Connection Warning (${error.message}). Falling back to resilient in-memory data store.`);
    inMemoryStore.isFallback = true;
    saveInMemoryStore();
  }
};

module.exports = { connectDB, inMemoryStore, saveInMemoryStore };
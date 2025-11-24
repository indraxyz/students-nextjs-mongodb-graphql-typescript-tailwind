import mongoose from "mongoose";
import { env } from "../config/env";

let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

const connectionOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxIdleTimeMS: 10000,
  retryWrites: true,
  retryReads: true,
};

let connectionHandlersRegistered = false;

const registerConnectionHandlers = () => {
  if (connectionHandlersRegistered) return;
  connectionHandlersRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log("🎉 Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    isConnected = false;
    connectionPromise = null;
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
    isConnected = false;
    connectionPromise = null;
  });

  process.on("SIGINT", async () => {
    await disconnectDB();
    process.exit(0);
  });
};

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log("✅ Database already connected");
      return mongoose;
    }

    if (connectionPromise) {
      console.log("🔄 Connection in progress, waiting...");
      return connectionPromise;
    }

    connectionPromise = mongoose.connect(env.MONGODB_URI, connectionOptions);

    const connection = await connectionPromise;

    isConnected = true;
    connectionPromise = null;

    registerConnectionHandlers();

    return connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    isConnected = false;
    connectionPromise = null;
    throw error;
  }
};

export async function disconnectDB(): Promise<void> {
  try {
    if (isConnected && mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
      connectionPromise = null;
      console.log("🔌 Database disconnected successfully");
    } else {
      console.log("ℹ️ Database is not connected");
    }
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
    throw error;
  }
}

export const isDBConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

export const getConnectionInfo = () => {
  return {
    isConnected: isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  };
};

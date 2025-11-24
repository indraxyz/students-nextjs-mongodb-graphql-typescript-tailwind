import mongoose from "mongoose";
import { env } from "@/server/config/env";

// Connection state management
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

// MongoDB connection options for better performance
const connectionOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  maxIdleTimeMS: 10000, // Close connections after 10 seconds of inactivity
  retryWrites: true, // Retry failed writes
  retryReads: true, // Retry failed reads
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
    // Return existing connection if already connected
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log("✅ Database already connected");
      return mongoose;
    }

    // Return existing connection promise if connection is in progress
    if (connectionPromise) {
      console.log("🔄 Connection in progress, waiting...");
      return connectionPromise;
    }

    // Create new connection promise
    connectionPromise = mongoose.connect(env.MONGODB_URI, connectionOptions);

    const connection = await connectionPromise;

    // Set connection state
    isConnected = true;
    connectionPromise = null;

    // Register connection event handlers (only once)
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

// Utility function to check connection status
export const isDBConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

// Utility function to get connection info
export const getConnectionInfo = () => {
  return {
    isConnected: isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  };
};

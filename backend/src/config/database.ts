// backend/src/config/database.ts
import { createConnection } from "typeorm";
import { User } from "../entities/User";
import { Software } from "../entities/Software";
import { Request } from "../entities/Request";
import dotenv from "dotenv";

dotenv.config();

export const connectDatabase = async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "user_access_management",
      entities: [User, Software, Request],
      synchronize: true, // Set to false in production
      logging: false,
    });

    console.log("Connected to PostgreSQL database");
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

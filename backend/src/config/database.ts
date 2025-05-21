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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Software, Request],
      synchronize: true,
      logging: false,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });

    console.log("Connected to PostgreSQL database");
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

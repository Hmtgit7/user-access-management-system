// src/entities/Request.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Software } from "./Software";

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Software, (software) => software.requests)
  @JoinColumn({ name: "softwareId" })
  software: Software;

  @Column()
  softwareId: number;

  @Column({
    type: "enum",
    enum: ["Read", "Write", "Admin"],
  })
  accessType: "Read" | "Write" | "Admin";

  @Column("text")
  reason: string;

  @Column({
    type: "enum",
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  })
  status: "Pending" | "Approved" | "Rejected";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  updatedAt: Date;

  // Change the type to allow null
  @Column({ nullable: true })
  reviewedBy: number | null;

  @Column({ type: "text", nullable: true })
  reviewComment: string;
}

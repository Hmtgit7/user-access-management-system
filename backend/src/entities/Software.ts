// backend/src/entities/Software.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Request } from "./Request";

@Entity()
export class Software {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column("simple-array")
  accessLevels: string[]; // e.g., ["Read", "Write", "Admin"]

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(() => Request, (request) => request.software)
  requests: Request[];
}

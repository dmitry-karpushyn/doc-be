import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor";

@ObjectType()
@Entity()
export class Appointment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  patientName: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  doctorId: number;

  @Field(() => Doctor)
  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;

  @Field()
  @CreateDateColumn()
  startTime: Date;

  @Field()
  @Column({
    default: 15,
  })
  durationMinutes: number;
}
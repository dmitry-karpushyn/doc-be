import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { Service } from "typedi";
import {Between, Repository} from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import {AddDoctorInput} from "@/models/doctor/AddDoctorInput";
import {DoctorAvail} from "@/types/Doctor/DoctorAvail";
import {Availability} from "@/entities/Availability";
import {differenceInDays, getDay, add, setHours, setMinutes, eachMinuteOfInterval, sub, isSameMinute} from "date-fns";
import {Appointment} from "@/entities/Appointment";

@Service()
export class DoctorService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availRepo: Repository<Availability>,
    @InjectRepository(Appointment)
    private readonly appointRepo: Repository<Appointment>,
  ) {}

  getDoctors() {
    return this.doctorRepo.find();
  }

  addDoctor(doctor: AddDoctorInput): Promise<Doctor> {
    return this.doctorRepo.save(doctor);
  }

  async addDoctorAvail({ doctorId, startTimeUtc, endTimeUtc, dayOfWeek }: DoctorAvail): Promise<Doctor> {
    await this.availRepo.save({doctorId, startTimeUtc, endTimeUtc, dayOfWeek});
    return this.doctorRepo.findOne({ where: {
      id: doctorId
      }
    }
    );
  }

  getAvailSlotsByDoctor(doctor: Doctor, from: Date, to: Date): Slot[] {
    const slots: Slot[] = [];
    const dayDiff = differenceInDays(to, from);
    for(let i = 0; i < dayDiff; i++) {
      let currentDay = add(from, {
        days: i
      });
      const dayOfWeek = getDay(currentDay)
      const availableDoctors = doctor?.availability?.filter((avil) => avil.dayOfWeek === dayOfWeek);
      if (availableDoctors?.length) {
        availableDoctors.forEach((availability) => {
          const fromTime = availability.startTimeUtc.split(":");
          const endTime = availability.endTimeUtc.split(":");
          const startDate = setMinutes(setHours(currentDay, Number(fromTime[0])),Number(fromTime[1]));
          const endDate = sub(setMinutes(setHours(currentDay, Number(endTime[0])),Number(endTime[1])), {minutes: 15});

          const doctorSlots = eachMinuteOfInterval({ start: startDate, end: endDate }, {step: 15});
          doctorSlots.forEach((slot) => {
            console.log('----------------------')
            console.log(slot)
            console.log(doctor?.appointments?.find(app => isSameMinute(app.startTime, slot)))
            if (!doctor?.appointments?.length || !doctor?.appointments?.find(app => isSameMinute(app.startTime, slot))) {
              slots.push({ doctorId: doctor.id, start: slot, end: add(slot, {minutes: 15}) });
            }
          })
        })
      }
    }
    return slots;
  }

  async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    try {
      const doctorList = await this.doctorRepo.find(
          {
            relations: ["appointments", "availability"]
          }
      );

      return doctorList.reduce((acc, doc) => acc.concat(this.getAvailSlotsByDoctor(doc, from, to)), []);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
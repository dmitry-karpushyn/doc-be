import { Appointment } from "@/entities/Appointment";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import {differenceInMinutes} from "date-fns";
import {Slot} from "@/models/appointments/Slot";

@Service()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
   
  ) {}

  getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async getAppointmentsBySlot(slot: Slot): Promise<Appointment> {
    return this.appointmentRepo.findOne({ where: { startTime: slot.start, doctorId: slot.doctorId }});
  }

  async bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    const { slot, patientName, description } = options;
    const isBlocked = await this.getAppointmentsBySlot(slot);
    if (isBlocked) {
      throw new Error("Appointment slot already taken");
    }
    const newAppointment = {
      doctorId: slot.doctorId,
      startTime: slot.start,
      durationMinutes: differenceInMinutes(slot.end, slot.start),
      patientName,
      description
    };
    const savedApp = await this.appointmentRepo.save(newAppointment);
    return this.appointmentRepo.findOne({ relations: ["doctor"], where: { id: savedApp.id } })
  }
}
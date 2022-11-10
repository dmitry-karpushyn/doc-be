import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { DoctorService } from "@/services/DoctorService";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}
  
  @Query(() => [Doctor])
  async doctors(): Promise<Doctor[]> {
    return this.doctorService.getDoctors();
  }

  @Mutation(() => Doctor)
  async addDoctor(
    @Arg('doctor') doctor: AddDoctorInput,
  ): Promise<Doctor> {
    return this.doctorService.addDoctor(doctor);
  }

  @Mutation(() => Doctor)
  async addDoctorAvail(
      @Arg('doctorId') doctorId: number,
      @Arg('endTimeUtc') startTimeUtc: string,
      @Arg('startTimeUtc') endTimeUtc: string,
      @Arg('dayOfWeek') dayOfWeek: number,
  ): Promise<Doctor> {
    return this.doctorService.addDoctorAvail({ doctorId, startTimeUtc, endTimeUtc, dayOfWeek });
  }

  @Query(() => [Slot])
  async slots(
    @Arg('from') from: Date,
    @Arg('to') to: Date,
  ): Promise<Slot[]> {
    return this.doctorService.getAvailableSlots(from, to);
  }
}
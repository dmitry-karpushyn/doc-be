import { faker } from '@faker-js/faker';

import { createApi } from '../api';

import { fetchSlots } from '../commands/doctors';
import { bookAppointment } from '../commands/appointments';
import { BookAppointmentInput } from '@/models/appointments/BookAppointmentInput';
import { Appointment } from '@/entities/Appointment';
import { Slot } from '@/models/appointments/Slot';
import {addDays, nextMonday, setHours, setMinutes} from "date-fns";

const api = createApi();

describe('Book appointment scenario', () => {
  it('should book appointment successfully', async () => {
    const from = setMinutes(setHours(nextMonday(new Date()), 11), 30);
    const to = addDays(from, 7);
    const slotsRes = await fetchSlots(api, from, to);

    const slots = slotsRes.body.data.slots as Slot[];
    const selectedSlot = slots[0];

    const bookAppointmentInput: BookAppointmentInput = {
      slot: selectedSlot,
      patientName: faker.name.firstName(),
      description: faker.lorem.lines(5),
    }

    const appointmentRes = await bookAppointment(api, bookAppointmentInput);
    const appointment = appointmentRes.body.data.bookAppointment as Appointment;

    expect(appointment.startTime).toBe(selectedSlot.start);
    expect(appointment.doctor.id).toBe(selectedSlot.doctorId);
  });
});

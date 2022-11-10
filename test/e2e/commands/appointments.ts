import { BookAppointmentInput } from '@/models/appointments/BookAppointmentInput';
import supertest from 'supertest';

import { Api } from '../api';

export const bookAppointment = (api: Api, bookAppointmentInput: BookAppointmentInput): supertest.Test =>
api.post('').send({
  query: `
    mutation BookAppointment($bookAppointmentInput: BookAppointmentInput!) {
  bookAppointment(bookAppointmentInput: $bookAppointmentInput) {
    durationMinutes
    id
    startTime
    patientName
    description
    doctorId
    doctor {
      id
    }
  }
}
`,
  variables: {
    bookAppointmentInput,
  },
});

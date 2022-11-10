import {number} from "yargs";

export type DoctorAvail = {
    doctorId: number;
    startTimeUtc: string;
    endTimeUtc: string;
    dayOfWeek: number;
}
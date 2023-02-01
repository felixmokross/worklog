import {
  addWeeks,
  startOfWeek,
  subWeeks,
  getISOWeekYear,
  getISOWeek,
  formatISO,
  parseISO,
  format,
  addMinutes,
  startOfDay,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export class CalendarWeek {
  private constructor(public readonly startDate: Date) {
    if (startDate.getDay() !== 1) {
      throw new Error("Start date must be a Monday");
    }
  }

  public static get current() {
    return this.fromDate(new Date());
  }

  public static fromDate(date: Date) {
    return new CalendarWeek(
      zonedTimeToUtc(startOfWeek(date, { weekStartsOn: 1 }), "UTC")
    );
  }

  public static fromString(input: string) {
    return new CalendarWeek(parseISO(input));
  }

  public next() {
    return new CalendarWeek(addWeeks(this.startDate, 1));
  }

  public previous() {
    return new CalendarWeek(subWeeks(this.startDate, 1));
  }

  public get year() {
    return getISOWeekYear(this.startDate);
  }

  public get week() {
    return getISOWeek(this.startDate);
  }

  public toString() {
    return formatISO(this.startDate, { representation: "date" });
  }
}

// using a constant date for this to ensure that we don't get a wrong time on DST changes
const timeFormattingDateRefDate = startOfDay(new Date("2023-01-01"));
function formatAsTime(minutes: number) {
  return format(addMinutes(timeFormattingDateRefDate, minutes), "HH:mm");
}

export class TimeSlot {
  public constructor(
    public readonly hour: number,
    public readonly quarter: number
  ) {}

  public get timeOfDay() {
    return new TimeOfDay(this.hour, this.quarter * 15);
  }

  public get minutes() {
    return this.timeOfDay.minutes;
  }

  public static fromMinutes(minutes: number) {
    return new TimeSlot(
      Math.floor(minutes / 60),
      Math.floor((minutes % 60) / 15)
    );
  }

  public get value() {
    return this.timeOfDay.value;
  }

  public static fromValue(value: number) {
    return this.fromMinutes(value);
  }

  public format() {
    return this.timeOfDay.format();
  }

  public toString() {
    return this.timeOfDay.toString();
  }

  public isBefore(other: TimeSlot) {
    return this.timeOfDay.isBefore(other.timeOfDay);
  }

  public isBeforeOrEqual(other: TimeSlot) {
    return this.timeOfDay.isBeforeOrEqual(other.timeOfDay);
  }

  public isAfterOrEqual(other: TimeSlot) {
    return this.timeOfDay.isAfterOrEqual(other.timeOfDay);
  }

  public isAfter(other: TimeSlot) {
    return this.timeOfDay.isAfter(other.timeOfDay);
  }

  public equals(other: TimeSlot) {
    return this.timeOfDay.equals(other.timeOfDay);
  }

  public next() {
    return this.quarter === 3
      ? new TimeSlot(this.hour + 1, 0)
      : new TimeSlot(this.hour, this.quarter + 1);
  }
}

export class TimePeriod {
  private constructor(
    public readonly start: TimeSlot,
    public readonly end: TimeSlot
  ) {}

  public static from(boundary1: TimeSlot, boundary2: TimeSlot) {
    return boundary1.isBeforeOrEqual(boundary2)
      ? new TimePeriod(boundary1, boundary2)
      : new TimePeriod(boundary2, boundary1);
  }

  public contains(timeSlot: TimeSlot) {
    return (
      timeSlot.isAfterOrEqual(this.start) && timeSlot.isBeforeOrEqual(this.end)
    );
  }

  public toString() {
    return `${this.start} - ${this.end.next()}`;
  }
}

export class TimeOfDay {
  public constructor(
    public readonly hour: number,
    public readonly minute: number
  ) {}

  public get minutes() {
    return this.hour * 60 + this.minute;
  }

  public static fromMinutes(minutes: number) {
    return new TimeOfDay(Math.floor(minutes / 60), minutes % 60);
  }

  public static fromValue(value: number) {
    return this.fromMinutes(value);
  }

  public get value() {
    return this.minutes;
  }

  public isBefore(other: TimeOfDay) {
    return this.value < other.value;
  }

  public isBeforeOrEqual(other: TimeOfDay) {
    return this.value <= other.value;
  }

  public isAfterOrEqual(other: TimeOfDay) {
    return this.value >= other.value;
  }

  public isAfter(other: TimeOfDay) {
    return this.value > other.value;
  }

  public equals(other: TimeOfDay) {
    return this.value === other.value;
  }

  public format() {
    return formatAsTime(this.minutes);
  }
  public toString() {
    return this.format();
  }
}

export type WorkEntryDto = { date: string; startTime: number; endTime: number };

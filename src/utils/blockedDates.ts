import type { BlockedDate } from "../types/appointment";
import { storageService } from "../services/storage";

export const getBlockedDateInfo = (
  date: string,
  blockedDates: BlockedDate[] = storageService.getBlockedDates(),
) =>
  blockedDates.find((blockedDate) => blockedDate.date === date);

export const isDateBlocked = (
  date: string,
  blockedDates: BlockedDate[] = storageService.getBlockedDates(),
) =>
  Boolean(getBlockedDateInfo(date, blockedDates));

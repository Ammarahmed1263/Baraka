import { parseReminderTime } from "@utils/parseReminderTime";

export interface ReminderTimePickerProps {
  visible: boolean;
  value: string; // "HH:mm"
  onChange: (event: any, date?: Date) => void;
  onClose: () => void;
}

export function getPickerDate(timeStr: string): Date {
  const { hour, minute } = parseReminderTime(timeStr);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

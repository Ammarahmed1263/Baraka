import DateTimePicker from "@react-native-community/datetimepicker";
import { ReminderTimePickerProps, getPickerDate } from "./ReminderTimePicker.types";

export function ReminderTimePicker({ visible, value, onChange }: ReminderTimePickerProps) {
  if (!visible) return null;

  return (
    <DateTimePicker
      value={getPickerDate(value)}
      mode="time"
      is24Hour={false}
      onChange={onChange}
    />
  );
}

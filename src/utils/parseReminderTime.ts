import { Time } from "@/types";

export const parseReminderTime = (time: string): Time => {
  const [hour, minute] = time.split(":").map(Number);

  return {
    hour,
    minute,
  };
};

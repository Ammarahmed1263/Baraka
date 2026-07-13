import { createMMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

const mmkv = createMMKV({ id: "baraka-store" });

export const storage = {
  getString: (key: string) => mmkv.getString(key),
  set: (key: string, value: string | number | boolean | ArrayBuffer) =>
    mmkv.set(key, value),
  delete: (key: string) => mmkv.remove(key),
  clearAll: () => mmkv.clearAll(),
};

export const storageAdapter: StateStorage = {
  setItem: (name, value) => {
    return mmkv.set(name, value);
  },
  getItem: (name) => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return mmkv.remove(name);
  },
};


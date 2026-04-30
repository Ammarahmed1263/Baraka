import { type UserProfile } from "@types";

export type RoleKey = keyof UserProfile;

export interface RoleInfo {
  key: RoleKey;
  tag: string;
  labelKey: string;
  icon: string;
  color: string;
}

export const ROLES: RoleInfo[] = [
  {
    key: "isHomemaker",
    tag: "homemaker",
    labelKey: "settings.role.homemaker",
    icon: "home",
    color: "#EC4899",
  },
  {
    key: "isParent",
    tag: "parent",
    labelKey: "settings.role.parent",
    icon: "users",
    color: "#F97316",
  },
  {
    key: "isStudent",
    tag: "student",
    labelKey: "settings.role.student",
    icon: "book",
    color: "#8B5CF6",
  },
  {
    key: "isProfessional",
    tag: "professional",
    labelKey: "settings.role.professional",
    icon: "briefcase",
    color: "#3B82F6",
  },
];

export function getRoleByTag(tag: string): RoleInfo | undefined {
  return ROLES.find((r) => r.tag === tag);
}

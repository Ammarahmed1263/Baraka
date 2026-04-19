export type Activity = {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  category: string;
  niyyahText: string;
  niyyahTextAr: string;
  hadithRef?: string;
  defaultTime?: string;
  color: string;
};

export type NiyyahOption = {
  id: string;
  activityId: string;
  level: "basic" | "advanced";
  text: string;
  textAr: string;
  source?: string;
  profileTag?: "homemaker" | "student" | "professional" | "parent";
};

export type EducationEntry = {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  content: string;
  contentAr: string;
  source: string;
  keywords: string[];
};

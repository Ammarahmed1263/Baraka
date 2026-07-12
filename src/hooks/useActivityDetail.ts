import { useState, useMemo, useCallback } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  useActivitiesStore,
  useLogsStore,
  useJournalStore,
  useSettingsStore,
} from "@store";
import { useTodayLogs } from "@hooks/useTodayLogs";
import { useLocalize } from "@hooks/useLocalize";
import { getTodayString } from "@utils/date";
import { Haptic } from "@utils/haptics";
import { getNiyyahOptions } from "@data/niyyahTemplates";
import { useNiyyahSelection } from "./useNiyyahSelection";
import { type NiyyahOption } from "@types";

type Step = "view" | "reflect";

export function useActivityDetail(id: string) {
  const localize = useLocalize();
  const { language: lang } = useTranslation().i18n;

  const activities = useActivitiesStore((s) => s.activities);
  const updateActivity = useActivitiesStore((s) => s.updateActivity);
  const settings = useSettingsStore((s) => s.settings);
  const getProfileTags = useSettingsStore((s) => s.getProfileTags);
  const markComplete = useLogsStore((s) => s.markComplete);
  const unmarkComplete = useLogsStore((s) => s.unmarkComplete);
  const addJournalEntry = useJournalStore((s) => s.addJournalEntry);
  const { isCompletedToday } = useTodayLogs();

  const activity = activities.find((a) => a.id === id);
  const profileTags = getProfileTags();
  const showBilingual = settings.showBilingual;
  const completed = isCompletedToday(id);
  const activityName = activity ? localize(activity.name) : "";

  const predefinedNiyyahs = useMemo(
    () => (activity ? getNiyyahOptions(activity.id, profileTags) : []),
    [activity?.id, profileTags]
  );

  const advancedNiyyahs = useMemo(
    () => predefinedNiyyahs.filter((n) => n.level === "advanced"),
    [predefinedNiyyahs]
  );

  const allAdvanced = useMemo(() => {
    if (!activity) return [];
    const customOptions: NiyyahOption[] = (activity.customNiyyahOptions || []).map(
      (o) => ({ ...o, activityId: activity.id, level: "advanced" as const })
    );
    return [...advancedNiyyahs, ...customOptions];
  }, [activity, advancedNiyyahs]);

  const activitySelectedIds = useMemo(() => {
    const ids = activity?.selectedNiyyahIds ?? [];
    return ids.filter((nId) => !nId.endsWith("_basic"));
  }, [activity?.selectedNiyyahIds]);

  const {
    localSelected,
    cleanSelected,
    cleanSelectedCount,
    ajrCount,
    toggleNiyyah,
  } = useNiyyahSelection(activitySelectedIds);

  const [step, setStep] = useState<Step>("view");
  const [reflectionNote, setReflectionNote] = useState("");
  const [impactfulNiyyah, setImpactfulNiyyah] = useState("");
  const [showEditNiyyah, setShowEditNiyyah] = useState(false);
  const [editedNiyyah, setEditedNiyyah] = useState(activity?.customNiyyah ?? "");

  const handleSaveAndRenew = useCallback(async () => {
    if (!activity) return;
    Haptic.success();
    updateActivity(activity.id, { selectedNiyyahIds: cleanSelected });
    markComplete(activity.id, cleanSelected);
    setStep("reflect");
  }, [activity, cleanSelected, updateActivity, markComplete]);

  const handleUnmark = useCallback(async () => {
    if (!activity) return;
    Haptic.lightTap();
    unmarkComplete(activity.id);
  }, [activity, unmarkComplete]);

  const handleSaveReflection = useCallback(async () => {
    if (!activity) return;
    if (reflectionNote.trim()) {
      addJournalEntry({
        activityId: activity.id,
        activityName: activity.name,
        date: getTodayString(),
        note: reflectionNote.trim(),
        selectedNiyyahCount: ajrCount,
        impactfulNiyyah: impactfulNiyyah || undefined,
      });
    }
    router.back();
  }, [activity, reflectionNote, ajrCount, impactfulNiyyah, addJournalEntry]);

  const handleSaveNiyyah = useCallback(async () => {
    if (!activity) return;
    updateActivity(activity.id, { customNiyyah: editedNiyyah });
    setShowEditNiyyah(false);
  }, [activity, editedNiyyah, updateActivity]);

  const handleAddCustomNiyyah = useCallback(
    async (text: string, textAr: string) => {
      if (!activity || !text.trim()) return;
      const newOption = {
        id:
          "custom_" +
          Date.now().toString() +
          Math.random().toString(36).substr(2, 5),
        text: {
          en: text.trim(),
          ar: textAr.trim() || text.trim(),
        },
      };
      const existing = activity.customNiyyahOptions || [];
      updateActivity(activity.id, {
        customNiyyahOptions: [...existing, newOption],
      });
    },
    [activity, updateActivity]
  );

  return {
    activity,
    activityName,
    showBilingual,
    completed,
    allAdvanced,
    step,
    setStep,
    localSelected,
    cleanSelectedCount,
    ajrCount,
    toggleNiyyah,
    reflectionNote,
    setReflectionNote,
    impactfulNiyyah,
    setImpactfulNiyyah,
    showEditNiyyah,
    setShowEditNiyyah,
    editedNiyyah,
    setEditedNiyyah,
    handleSaveAndRenew,
    handleUnmark,
    handleSaveReflection,
    handleSaveNiyyah,
    handleAddCustomNiyyah,
    lang,
    localize,
  };
}

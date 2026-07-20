
import { View, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import { useActivityDetail } from "@hooks/useActivityDetail";
import { ActivityNotFound } from "@components/Activity/ActivityNotFound";
import { ActivityViewStep } from "@components/Activity/ActivityViewStep";
import { ActivityReflectStep } from "@components/Activity/ActivityReflectStep";
import { SettingsToast } from "@components/Settings/SettingsToast";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useActivityDetail(id);
  const { colors: C } = useTheme();

  if (!state.activity) {
    return <ActivityNotFound />;
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <SettingsToast
        message={state.toastMessage}
        animatedStyle={state.animatedToastStyle}
        isWeb={Platform.OS === "web"}
      />
      {state.step === "reflect" ? (
        <ActivityReflectStep
          activityName={state.activityName}
          allAdvanced={state.allAdvanced}
          localSelected={state.localSelected}
          reflectionNote={state.reflectionNote}
          setReflectionNote={state.setReflectionNote}
          impactfulNiyyah={state.impactfulNiyyah}
          setImpactfulNiyyah={state.setImpactfulNiyyah}
          onSaveReflection={state.handleSaveReflection}
          cleanSelectedCount={state.cleanSelectedCount}
          ajrCount={state.ajrCount}
          localize={state.localize}
        />
      ) : (
        <ActivityViewStep
          activity={state.activity}
          activityName={state.activityName}
          showBilingual={state.showBilingual}
          completed={state.completed}
          allAdvanced={state.allAdvanced}
          localSelected={state.localSelected}
          toggleNiyyah={state.toggleNiyyah}
          showEditNiyyah={state.showEditNiyyah}
          setShowEditNiyyah={state.setShowEditNiyyah}
          editedNiyyah={state.editedNiyyah}
          setEditedNiyyah={state.setEditedNiyyah}
          onSaveNiyyah={state.handleSaveNiyyah}
          onAddCustomNiyyah={state.handleAddCustomNiyyah}
          onSaveAndRenew={state.handleSaveAndRenew}
          onUnmark={state.handleUnmark}
          localize={state.localize}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

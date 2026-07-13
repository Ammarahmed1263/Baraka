import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AppButton } from "@components/UI/AppButton";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title"), headerShown: false }} />
      <View
        style={[
          styles.container,
          {
            backgroundColor: C.background,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: C.backgroundSubtle }]}>
          <Feather name="compass" size={56} color={C.tint} />
        </View>

        <AppText weight="Bold" style={[styles.title, { color: C.text }]}>
          {t("notFound.title")}
        </AppText>

        <AppText weight="Regular" style={[styles.message, { color: C.textSecondary }]}>
          {t("notFound.message")}
        </AppText>

        <AppButton
          variant="primary"
          label={t("notFound.goHome")}
          icon="home"
          haptic="light"
          onPress={() => router.replace("/")}
          style={styles.button}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 36,
    maxWidth: 280,
  },
  button: {
    width: "100%",
    maxWidth: 240,
  },
});

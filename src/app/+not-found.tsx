import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AppButton } from "@components/UI/AppButton";
import { spacing } from "@constants/spacing";

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
            paddingTop: insets.top + spacing.xxl,
            paddingBottom: insets.bottom + spacing.xxl,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: C.backgroundSubtle }]}>
          <Feather name="compass" size={56} color={C.tint} />
        </View>

        <AppText weight="Bold" variant='titleLarge' style={[styles.title, { color: C.text }]}>
          {t("notFound.title")}
        </AppText>

        <AppText weight="Regular" variant='bodyLarge' style={[styles.message, { color: C.textSecondary }]}>
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
    paddingHorizontal: spacing.xxl,
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  message: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xxxl,
    maxWidth: 280,
  },
  button: {
    width: "100%",
    maxWidth: 240,
  },
});

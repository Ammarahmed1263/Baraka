import { forwardRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useTheme } from "@context/ThemeContext";

interface AppBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  onClose?: () => void;
  enablePanDownToClose?: boolean;
}

export const AppBottomSheet = forwardRef<BottomSheetModal, AppBottomSheetProps>(
  (
    { children, snapPoints = ["25%", "50%"], onClose, enablePanDownToClose = true },
    ref
  ) => {
    const { colors: C } = useTheme();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: C.backgroundCard }}
        handleIndicatorStyle={{ backgroundColor: C.border }}
        onDismiss={() => {
          if (onClose) onClose();
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
  },
});

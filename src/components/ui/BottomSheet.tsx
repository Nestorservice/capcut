import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import GorhomBottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  onClose?: () => void;
  enablePanDownToClose?: boolean;
}

export const BottomSheet = forwardRef<BottomSheetRef, Props>(
  ({ snapPoints = ['50%'], children, onClose, enablePanDownToClose = true }, ref) => {
    const sheetRef = useRef<GorhomBottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} />
    );

    return (
      <GorhomBottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bg}
        handleIndicatorStyle={styles.handle}
        onClose={onClose}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.inner}>{children}</View>
        </BottomSheetView>
      </GorhomBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  bg: { backgroundColor: Colors.bg.panel, borderTopLeftRadius: Dim.radius.xl, borderTopRightRadius: Dim.radius.xl },
  handle: { backgroundColor: Colors.border.medium, width: 40, height: 4 },
  content: { flex: 1 },
  inner: { padding: Dim.spacing.lg },
});

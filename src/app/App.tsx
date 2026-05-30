import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { RootNavigator } from '@navigation/RootNavigator';
import { ToastHost } from '@components/ui/Toast';
import { LoadingOverlay } from '@components/ui/LoadingOverlay';
import { useUIStore } from '@store/uiStore';

function GlobalOverlays() {
  const isLoading = useUIStore(s => s.isLoadingOverlay);
  const message = useUIStore(s => s.loadingMessage);
  return (
    <>
      <ToastHost />
      <LoadingOverlay visible={isLoading} message={message} />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <StatusBar barStyle="light-content" backgroundColor="#000000" />
              <View style={styles.root}>
                <RootNavigator />
                <GlobalOverlays />
              </View>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
});

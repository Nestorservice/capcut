import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useAuthStore } from '@store/authStore';
import { Colors } from '@constants/colors';
import { RootStackParamList } from '@types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: Colors.bg.toolbar,
    border: Colors.border.light,
    text: Colors.text.primary,
    primary: Colors.accent.pink,
  },
};

export function RootNavigator() {
  const session = useAuthStore(s => s.session);
  const isHydrated = useAuthStore(s => s.isHydrated);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={Colors.accent.pink} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {session ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
});

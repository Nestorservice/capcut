import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { MainStackParamList, MainTabsParamList } from '@types/navigation.types';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { HomeScreen } from '@screens/home/HomeScreen';
import { ProjectsScreen } from '@screens/projects/ProjectsScreen';
import { ProfileScreen } from '@screens/profile/ProfileScreen';
import { SettingsScreen } from '@screens/settings/SettingsScreen';
import { NotificationsScreen } from '@screens/notifications/NotificationsScreen';
import { MediaPickerScreen } from '@screens/mediaPicker/MediaPickerScreen';
import { EditorNavigator } from './EditorNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();

function CreatePlaceholder() {
  return <View style={styles.placeholder} />;
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface.container,
          borderTopColor: Colors.border.light,
          height: Dim.tabBar.height,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.accent.pink,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, focused }) => {
          const iconName =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Projects'
                ? 'folder-open'
                : route.name === 'Me'
                  ? 'person'
                  : 'add-circle';
          return <Icon name={iconName} size={focused ? 26 : 24} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen
        name="Create"
        component={CreatePlaceholder}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.getParent()?.navigate('MediaPicker', { mode: 'new' });
          },
        })}
      />
      <Tabs.Screen name="Projects" component={ProjectsScreen} />
      <Tabs.Screen name="Me" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="MediaPicker" component={MediaPickerScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Editor" component={EditorNavigator} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, backgroundColor: '#000000' },
});

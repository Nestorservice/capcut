import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { VideoEditorScreen } from '@screens/editor/VideoEditorScreen';
import { TrimToolScreen } from '@screens/editor/TrimToolScreen';
import { SplitToolScreen } from '@screens/editor/SplitToolScreen';
import { SpeedControlScreen } from '@screens/editor/SpeedControlScreen';
import { TextEditorScreen } from '@screens/editor/TextEditorScreen';
import { TextAnimationScreen } from '@screens/editor/TextAnimationScreen';
import { AudioMusicScreen } from '@screens/editor/AudioMusicScreen';
import { VoiceoverScreen } from '@screens/editor/VoiceoverScreen';
import { FiltersScreen } from '@screens/editor/FiltersScreen';
import { AdjustScreen } from '@screens/editor/AdjustScreen';
import { TransitionScreen } from '@screens/editor/TransitionScreen';
import { OverlayScreen } from '@screens/editor/OverlayScreen';
import { StickersScreen } from '@screens/editor/StickersScreen';
import { KeyframeScreen } from '@screens/editor/KeyframeScreen';
import { FormatScreen } from '@screens/editor/FormatScreen';
import { ExportSettingsScreen } from '@screens/editor/ExportSettingsScreen';
import { ExportProgressScreen } from '@screens/editor/ExportProgressScreen';
import { ExportCompleteScreen } from '@screens/editor/ExportCompleteScreen';

const Stack = createNativeStackNavigator<EditorStackParamList>();

export function EditorNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="VideoEditor" component={VideoEditorScreen} />
      <Stack.Screen name="TrimTool" component={TrimToolScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="SplitTool" component={SplitToolScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="SpeedControl" component={SpeedControlScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TextEditor" component={TextEditorScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TextAnimation" component={TextAnimationScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AudioMusic" component={AudioMusicScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Voiceover" component={VoiceoverScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Filters" component={FiltersScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Adjust" component={AdjustScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Transition" component={TransitionScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Overlay" component={OverlayScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Stickers" component={StickersScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Keyframe" component={KeyframeScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Format" component={FormatScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ExportSettings" component={ExportSettingsScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ExportProgress" component={ExportProgressScreen} options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="ExportComplete" component={ExportCompleteScreen} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
}

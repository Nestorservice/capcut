import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
};

export type EditorStackParamList = {
  VideoEditor: { projectId: string };
  TrimTool: { clipId: string };
  SplitTool: { clipId: string };
  SpeedControl: { clipId: string };
  TextEditor: { overlayId?: string };
  TextAnimation: { overlayId: string };
  AudioMusic: undefined;
  Voiceover: undefined;
  Filters: { clipId: string };
  Adjust: { clipId: string };
  Transition: { clipId: string; nextClipId: string };
  Overlay: undefined;
  Stickers: undefined;
  Keyframe: { targetId: string; targetType: 'clip' | 'text' | 'sticker' };
  Format: undefined;
  ExportSettings: { projectId: string };
  ExportProgress: { projectId: string };
  ExportComplete: { projectId: string; outputUri: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Create: undefined;
  Projects: undefined;
  Me: undefined;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabsParamList>;
  MediaPicker: { mode: 'new' | 'add'; projectId?: string };
  Profile: { userId?: string };
  Settings: undefined;
  Notifications: undefined;
  Editor: NavigatorScreenParams<EditorStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

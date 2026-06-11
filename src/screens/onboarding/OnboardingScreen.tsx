import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, NativeScrollEvent, NativeSyntheticEvent, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStackParamList } from '@types/navigation.types';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useAuthStore } from '@store/authStore';
import { useAuth } from '@hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const SCREEN_W = Dimensions.get('window').width;

interface Slide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  gradient: readonly [string, string];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'movie-creation',
    title: 'Powerful Editor',
    subtitle: 'Cut, trim, and combine clips with frame-perfect precision.',
    gradient: ['#ff4081', '#9c27b0'] as const,
  },
  {
    id: '2',
    icon: 'auto-awesome',
    title: 'Cinematic Effects',
    subtitle: 'Apply pro filters, color grading, and animated text overlays.',
    gradient: ['#7c4dff', '#03a9f4'] as const,
  },
  {
    id: '3',
    icon: 'cloud-upload',
    title: 'Anywhere, Anytime',
    subtitle: 'Your projects sync to the cloud. Pick up where you left off.',
    gradient: ['#00bfa5', '#1de9b6'] as const,
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const completeOnboarding = useAuthStore(s => s.completeOnboarding);
  const { signInAnonymously, isLoading } = useAuth();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setIndex(i);
  };

  const handleFinish = async () => {
    completeOnboarding();
    try {
      await signInAnonymously();
      // RootNavigator will automatically switch to Main when session exists
    } catch (e) {
      // Error handled by useAuth toast
    }
  };

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      handleFinish();
    }
  };

  const skip = () => {
    handleFinish();
  };

  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>CapCut</Text>
        {index < SLIDES.length - 1 ? (
          <Text onPress={skip} style={styles.skip}>Skip</Text>
        ) : <View style={{ width: 60 }} />}
      </View>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_W }]}>
            <LinearGradient
              colors={item.gradient as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconWrap}
            >
              <Icon name={item.icon} size={64} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.footer}>
        <Button
          label={index === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          onPress={goNext}
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color="#ffffff" style={{ marginLeft: 8 }} />}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000', paddingTop: 48 },
  topRow: { paddingHorizontal: Dim.spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#ffffff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  skip: { color: Colors.text.secondary, fontSize: Typography.sizes.base, fontWeight: '600', padding: 8 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Dim.spacing.xl, flex: 1 },
  iconWrap: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { color: Colors.text.secondary, fontSize: Typography.sizes.base, textAlign: 'center', lineHeight: 24, maxWidth: 320 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border.default },
  dotActive: { backgroundColor: Colors.accent.pink, width: 24 },
  footer: { paddingHorizontal: Dim.spacing.lg, paddingBottom: 40, gap: 16 },
});

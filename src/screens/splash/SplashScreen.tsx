import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '@types/navigation.types';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const goNext = React.useCallback(() => {
    navigation.replace('Onboarding');
  }, [navigation]);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 130 });
    opacity.value = withTiming(1, { duration: 700 });
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      scale.value = withSequence(withTiming(1.05, { duration: 220 }), withTiming(0.95, { duration: 220 }));
      opacity.value = withTiming(0, { duration: 350 });
      subtitleOpacity.value = withTiming(0, { duration: 350 }, finished => {
        'worklet';
        if (finished) {
          runOnJS(goNext)();
        }
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [goNext, opacity, scale, subtitleOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.glow}>
        <LinearGradient
          colors={['rgba(255,64,129,0.35)', 'rgba(156,39,176,0.2)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <Animated.View style={[styles.logoBlock, logoStyle]}>
        <Image source={require('@assets/images/logo.png')} style={styles.logoMark} resizeMode="contain" />
        <Text style={styles.logoText}>CapCut</Text>
      </Animated.View>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>Create. Edit. Inspire.</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  glow: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', opacity: 0.7 },
  logoBlock: { alignItems: 'center' },
  logoMark: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logoText: { color: '#ffffff', fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  subtitle: { marginTop: 18, color: Colors.text.secondary, fontSize: Typography.sizes.base, letterSpacing: 1 },
});

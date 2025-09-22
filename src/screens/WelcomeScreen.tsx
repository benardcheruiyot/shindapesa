import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { PataPesaLogo } from '../components/PataPesaLogo';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onFinish: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  // Core anim values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const ringPulse = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const spinner = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const steps = useMemo(
    () => [
      'Initializing ShindaPesa…',
      'Securing your session…',
      'Fetching your rewards…',
      'Preparing experience…',
    ],
    []
  );

  useEffect(() => {
    // Fade and logo pop-in
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();

    // Concentric ring pulse (0 -> 1)
    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(ringPulse, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    );
    ringLoop.start();

    // Rotating glow
    const spinLoop = Animated.loop(
      Animated.timing(spinner, { toValue: 1, duration: 3200, useNativeDriver: true })
    );
    spinLoop.start();

    // Ripple from center
    const rippleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ripple, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(ripple, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    );
    rippleLoop.start();

    // Step messages and progress
    let step = 0;
    const stepTimer = setInterval(() => {
      step = (step + 1) % steps.length;
      setStepIndex(step);
    }, 1200);

    const progressTick = () => {
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 3600, useNativeDriver: false }).start(
        progressTick
      );
    };
    progressTick();

    // Minimum display time then handoff
    const timeout = setTimeout(() => onFinish(), 5200);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(timeout);
    };
  }, [fadeIn, logoScale, ringPulse, spinner, ripple, progress, steps, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#001a33" barStyle="light-content" />

      {/* Background gradient */}
      <View style={styles.bg} />

      {/* Rotating glow */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.rotatingGlow,
          {
            transform: [
              {
                rotate: spinner.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
            opacity: fadeIn,
          },
        ]}
      />

      {/* Center stack */}
      <Animated.View style={[styles.center, { opacity: fadeIn }] }>
        {/* Concentric rings */}
        <View style={styles.ringsWrap}>
          {[0, 1, 2].map((i) => {
            const scale = ringPulse.interpolate({
              inputRange: [0, 1],
              outputRange: [1 + i * 0.05, 1.15 + i * 0.05],
            });
            const opacity = ringPulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.08] });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.ring,
                  {
                    transform: [{ scale }],
                    opacity,
                    borderColor: 'rgba(255,255,255,0.35)'
                  },
                ]}
              />
            );
          })}
          {/* Ripple wave */}
          <Animated.View
            style={[
              styles.ripple,
              {
                opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0] }),
                transform: [
                  {
                    scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }),
                  },
                ],
              },
            ]}
          />

          {/* Logo */}
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <PataPesaLogo size={96} color="#00A651" />
          </Animated.View>
        </View>

        {/* Title and tagline */}
        <Text style={styles.appTitle}>ShindaPesa</Text>
        <Text style={styles.tagline}>Win daily. Withdraw instantly.</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['8%', '100%'] }) },
            ]}
          />
        </View>

        {/* Step message */}
        <Text style={styles.stepText}>{steps[stepIndex]}</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeIn }] }>
        <Text style={styles.footerText}>Secure • Fair • Fast</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001a33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#003366',
  },
  rotatingGlow: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringsWrap: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
  },
  ripple: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0,166,81,0.14)',
  },
  appTitle: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tagline: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    marginTop: 4,
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#00A651',
    borderRadius: 8,
  },
  stepText: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 10,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    letterSpacing: 0.4,
  },
});

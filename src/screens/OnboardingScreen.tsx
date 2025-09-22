import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type Props = {
  onComplete: () => void;
};

const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const steps = useMemo(
    () => [
      {
        emoji: '🎯',
        title: 'Spin and Win Cash',
        description: 'Try your luck on the wheel and earn points and prizes every day.',
        highlights: [
          'Daily free spin for new users',
          'Bonus points for referrals',
          'Fair odds and instant feedback',
        ],
      },
      {
        emoji: '🎁',
        title: 'Refer and Earn',
        description: 'Invite friends and earn bonuses when they join and play.',
        highlights: [
          'Share your referral code',
          'Get bonus when they register',
          'Track referrals in the app',
        ],
      },
      {
        emoji: '',
        title: 'Withdraw Instantly',
        description: 'Cash out your winnings straight to M-PESA with no delays.',
        highlights: [
          'Instant withdrawals',
          'Low withdrawal thresholds',
          '24/7 availability',
        ],
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const isLast = index === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleSkip = () => onComplete();

  const step = steps[index];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === index ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroEmoji}>{step.emoji}</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.description}</Text>

        <View style={styles.highlightsContainer}>
          {step.highlights.map((h, i) => (
            <View key={i} style={styles.highlight}>
              <Text style={styles.highlightIcon}>•</Text>
              <Text style={styles.highlightText}>{h}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.backButton, index === 0 && { opacity: 0.5 }]}
            onPress={handleBack}
            disabled={index === 0}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{isLast ? 'Done' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footnote}>By continuing, you agree to our Terms & Privacy.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 4,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#003366',
  },
  progressDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  heroEmoji: {
    fontSize: 56,
    color: 'white',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 18,
  },
  highlightsContainer: {
    width: '100%',
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#003366',
  },
  highlightText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    minWidth: 90,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#003366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  footnote: {
    marginTop: 10,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default OnboardingScreen;

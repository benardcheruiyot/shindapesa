import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// Onboarding steps removed
// The onboarding logic has been removed, including the state and functions related to it.


type OnboardingScreenProps = {
  onComplete: () => void;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      {/* Hero */}
      <View style={styles.heroBadge}>
        <Text style={styles.heroEmoji}>🎰</Text>
      </View>
      <Text style={styles.title}>ShindaPesa</Text>
      <Text style={styles.subtitle}>Spin. Win. Withdraw instantly.</Text>

      {/* Highlights */}
      <View style={styles.highlightsContainer}>
        <View style={styles.highlight}>
          <Text style={styles.highlightIcon}>⚡</Text>
          <Text style={styles.highlightText}>Instant M-Pesa withdrawals</Text>
        </View>
        <View style={styles.highlight}>
          <Text style={styles.highlightIcon}>🔒</Text>
          <Text style={styles.highlightText}>Secure & trusted experience</Text>
        </View>
        <View style={styles.highlight}>
          <Text style={styles.highlightIcon}>🎁</Text>
          <Text style={styles.highlightText}>Daily bonus spins for new users</Text>
        </View>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity style={styles.nextButton} onPress={onComplete}>
        <Text style={styles.nextButtonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Secondary note */}
      <Text style={styles.footnote}>By continuing, you agree to our Terms & Privacy.</Text>
    </View>
  </SafeAreaView>
);

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
    paddingBottom: 20,
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
    marginBottom: 40,
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
    fontSize: 30,
    fontWeight: '800',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 50,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  highlightsContainer: {
    width: '100%',
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  highlightText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
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
    minWidth: 80,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
    backgroundColor: '#003366',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  footnote: {
    marginTop: 12,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default OnboardingScreen;

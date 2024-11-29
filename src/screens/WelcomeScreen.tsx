import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { GuardianAI } from '../components/GuardianAI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WelcomeScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const theme = useTheme();

  const welcomeSteps = [
    "Welcome to Narcoguard. I'm Guardian, your AI assistant. I'm here to help protect you and guide you through using this life-saving application.",
    "Narcoguard is designed to help prevent opioid overdoses and provide immediate assistance in emergency situations. Let's set up your preferences to ensure you get the most out of this app.",
    "First, let's make sure you can see and hear everything clearly. We'll adjust the display and sound settings.",
  ];

  const handleNext = async () => {
    if (step < welcomeSteps.length - 1) {
      setStep(step + 1);
    } else {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      navigation.replace('Settings');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GuardianAI
        message={welcomeSteps[step]}
        onMessageComplete={handleNext}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
        >
          Continue
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginTop: 20,
  },
});
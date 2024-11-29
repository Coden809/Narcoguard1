import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  volume: number;
  voiceLanguage: string;
  emergencyContacts: string[];
  naloxoneLocation: string;
  heroMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  fontSize: 'medium',
  volume: 0.8,
  voiceLanguage: 'en-US',
  emergencyContacts: [],
  naloxoneLocation: '',
  heroMode: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return { settings, updateSettings };
};
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text, useTheme, RadioButton } from 'react-native-paper';
import { GuardianAI } from '../components/GuardianAI';
import { useSettings } from '../hooks/useSettings';

export const DisplaySettingsScreen = () => {
  const { settings, updateSettings } = useSettings();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GuardianAI
        message="Let's make sure you can see everything clearly. You can adjust the theme and text size here."
      />
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Theme</Text>
        <View style={styles.option}>
          <Text style={{ color: theme.colors.text }}>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSettings({ darkMode: value })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Text Size</Text>
        <RadioButton.Group
          value={settings.fontSize}
          onValueChange={(value) => updateSettings({ fontSize: value })}
        >
          <RadioButton.Item label="Small" value="small" />
          <RadioButton.Item label="Medium" value="medium" />
          <RadioButton.Item label="Large" value="large" />
        </RadioButton.Group>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
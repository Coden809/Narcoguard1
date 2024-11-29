import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { GuardianAI } from '../components/GuardianAI';

export const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GuardianAI
        message="Let's customize Narcoguard to work best for you. What would you like to set up first?"
      />
      <List.Section>
        <List.Item
          title="Display Settings"
          description="Adjust theme and font size"
          left={props => <List.Icon {...props} icon="palette" />}
          onPress={() => handleNavigation('DisplaySettings')}
        />
        <List.Item
          title="Audio Settings"
          description="Adjust volume and voice preferences"
          left={props => <List.Icon {...props} icon="volume-high" />}
          onPress={() => handleNavigation('AudioSettings')}
        />
        <List.Item
          title="Emergency Contacts"
          description="Set up who to notify in emergencies"
          left={props => <List.Icon {...props} icon="account-multiple" />}
          onPress={() => handleNavigation('EmergencyContacts')}
        />
        <List.Item
          title="Naloxone Setup"
          description="Configure naloxone location and availability"
          left={props => <List.Icon {...props} icon="medical-bag" />}
          onPress={() => handleNavigation('NaloxoneSetup')}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
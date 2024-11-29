import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DisplaySettingsScreen } from '../screens/DisplaySettingsScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Setup Narcoguard' }}
        />
        <Stack.Screen 
          name="DisplaySettings" 
          component={DisplaySettingsScreen}
          options={{ title: 'Display Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
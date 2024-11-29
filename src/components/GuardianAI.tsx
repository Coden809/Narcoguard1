import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import * as Speech from 'react-native-tts';

interface GuardianAIProps {
  message: string;
  onMessageComplete?: () => void;
}

export const GuardianAI: React.FC<GuardianAIProps> = ({ message, onMessageComplete }) => {
  const theme = useTheme();

  React.useEffect(() => {
    Speech.speak(message, {
      onDone: () => onMessageComplete?.(),
    });

    return () => {
      Speech.stop();
    };
  }, [message, onMessageComplete]);

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={80}
        source={require('../assets/guardian-ai.png')}
        style={styles.avatar}
      />
      <View style={[styles.messageContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
});
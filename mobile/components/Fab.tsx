import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../colors';

type Props = {
  onPress: () => void;
};

const FAB = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.container}
      onPress={onPress}
    >
      <Ionicons name="add" size={30} color="#FFF" testID="icon" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default FAB;

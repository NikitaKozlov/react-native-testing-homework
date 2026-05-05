import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../colors';

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

const Search = ({ value, onSearch }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Text input field"
        style={styles.input}
        placeholder="Filter lotteries"
        value={value}
        onChangeText={onSearch}
      />
      <Ionicons name="search" size={16} color="#999999" testID="icon" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.grey,
    backgroundColor: colors.secondary,
    paddingHorizontal: 23,
    width: 300,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingRight: 10,
  },
});

export default Search;

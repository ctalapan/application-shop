import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onPress,
  placeholder,
  editable = true,
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={editable ? 1 : 0.7}
      onPress={!editable ? onPress : undefined}
    >
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder || '搜索商品、品牌、供应商'}
        placeholderTextColor={COLORS.textHint}
        returnKeyType="search"
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText?.('')} style={styles.clearBtn}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 22,
    paddingHorizontal: SPACING.md,
    height: 40,
    flex: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 12,
    color: COLORS.textHint,
  },
});

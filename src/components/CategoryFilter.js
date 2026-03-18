import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, CATEGORIES } from '../utils/constants';

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {CATEGORIES.map(cat => {
        const isActive = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  item: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginRight: SPACING.xs,
    flexDirection: 'row',
    gap: 4,
  },
  itemActive: {
    backgroundColor: '#EAF4FF',
    borderColor: COLORS.primary,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

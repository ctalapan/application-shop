import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  CATEGORIES,
  REGIONS,
  BRANDS,
  SORT_OPTIONS,
} from '../utils/constants';

const PRICE_RANGES = [
  { label: '不限', min: '', max: '' },
  { label: '0-1000', min: '0', max: '1000' },
  { label: '1000-1万', min: '1000', max: '10000' },
  { label: '1万-10万', min: '10000', max: '100000' },
  { label: '10万以上', min: '100000', max: '' },
];

const MIN_ORDER_OPTIONS = [
  { label: '不限', value: '' },
  { label: '≤10', value: '10' },
  { label: '≤50', value: '50' },
  { label: '≤100', value: '100' },
  { label: '≤500', value: '500' },
];

export default function FilterPanel({ visible, filters, onApply, onClose }) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const update = (key, value) => setLocalFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    const reset = {
      category: 'all',
      brand: 'all',
      region: 'all',
      sort: 'default',
      minPrice: '',
      maxPrice: '',
      minOrder: '',
    };
    setLocalFilters(reset);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.panel}>
        <View style={styles.handle} />
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>筛选条件</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>重置</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort */}
          <Text style={styles.sectionTitle}>排序</Text>
          <View style={styles.tagRow}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.tag, localFilters.sort === opt.key && styles.tagActive]}
                onPress={() => update('sort', opt.key)}
              >
                <Text
                  style={[styles.tagText, localFilters.sort === opt.key && styles.tagTextActive]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category */}
          <Text style={styles.sectionTitle}>分类</Text>
          <View style={styles.tagRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.tag, localFilters.category === cat.id && styles.tagActive]}
                onPress={() => update('category', cat.id)}
              >
                <Text
                  style={[styles.tagText, localFilters.category === cat.id && styles.tagTextActive]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text style={styles.sectionTitle}>价格区间</Text>
          <View style={styles.tagRow}>
            {PRICE_RANGES.map((r) => {
              const isActive = localFilters.minPrice === r.min && localFilters.maxPrice === r.max;
              return (
                <TouchableOpacity
                  key={r.label}
                  style={[styles.tag, isActive && styles.tagActive]}
                  onPress={() => {
                    update('minPrice', r.min);
                    update('maxPrice', r.max);
                  }}
                >
                  <Text style={[styles.tagText, isActive && styles.tagTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.priceInputRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="最低价(¥)"
              keyboardType="numeric"
              value={localFilters.minPrice}
              onChangeText={(v) => update('minPrice', v)}
              placeholderTextColor={COLORS.textHint}
            />
            <Text style={styles.priceSep}>—</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="最高价(¥)"
              keyboardType="numeric"
              value={localFilters.maxPrice}
              onChangeText={(v) => update('maxPrice', v)}
              placeholderTextColor={COLORS.textHint}
            />
          </View>

          {/* Min Order */}
          <Text style={styles.sectionTitle}>起订量</Text>
          <View style={styles.tagRow}>
            {MIN_ORDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.tag, localFilters.minOrder === opt.value && styles.tagActive]}
                onPress={() => update('minOrder', opt.value)}
              >
                <Text
                  style={[
                    styles.tagText,
                    localFilters.minOrder === opt.value && styles.tagTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Region */}
          <Text style={styles.sectionTitle}>地区</Text>
          <View style={styles.tagRow}>
            {REGIONS.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.tag, localFilters.region === r.id && styles.tagActive]}
                onPress={() => update('region', r.id)}
              >
                <Text
                  style={[styles.tagText, localFilters.region === r.id && styles.tagTextActive]}
                >
                  {r.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Brand */}
          <Text style={styles.sectionTitle}>品牌</Text>
          <View style={styles.tagRow}>
            {BRANDS.slice(0, 8).map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.tag, localFilters.brand === b.id && styles.tagActive]}
                onPress={() => update('brand', b.id)}
              >
                <Text style={[styles.tagText, localFilters.brand === b.id && styles.tagTextActive]}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>确认筛选</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  panelTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  resetText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginBottom: 4,
    backgroundColor: COLORS.white,
  },
  tagActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF4FF',
  },
  tagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  tagTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  priceInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  priceSep: {
    color: COLORS.textHint,
    fontSize: FONT_SIZES.md,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  applyBtn: {
    flex: 2,
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

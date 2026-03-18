import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  PRODUCTS,
  CATEGORIES,
  SORT_OPTIONS,
} from '../../utils/constants';
import { filterProducts } from '../../utils/helpers';
import ProductCard from '../../components/ProductCard';
import FilterPanel from '../../components/FilterPanel';
import SearchBar from '../../components/SearchBar';

const DEFAULT_FILTERS = {
  category: 'all',
  brand: 'all',
  region: 'all',
  sort: 'default',
  minPrice: '',
  maxPrice: '',
  minOrder: '',
  keyword: '',
};

export default function ProductListScreen({ navigation, route }) {
  const initCategory = route.params?.category || 'all';
  const initKeyword = route.params?.keyword || '';

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: initCategory,
    keyword: initKeyword,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const products = filterProducts(PRODUCTS, filters);

  const handleProductPress = useCallback(
    (product) => navigation.navigate('ProductDetail', { product }),
    [navigation],
  );

  const renderProduct = ({ item }) =>
    viewMode === 'grid' ? (
      <View style={{ flex: 1, maxWidth: '50%' }}>
        <ProductCard product={item} onPress={handleProductPress} viewMode="grid" />
      </View>
    ) : (
      <ProductCard product={item} onPress={handleProductPress} viewMode="list" />
    );

  const renderHeader = () => (
    <View>
      <View style={styles.sortBar}>
        {SORT_OPTIONS.slice(0, 4).map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortItem, filters.sort === opt.key && styles.sortItemActive]}
            onPress={() => setFilters((prev) => ({ ...prev, sort: opt.key }))}
          >
            <Text style={[styles.sortText, filters.sort === opt.key && styles.sortTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>共 {products.length} 件</Text>
        <TouchableOpacity onPress={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}>
          <Text style={styles.viewModeBtn}>{viewMode === 'grid' ? '≡ 列表' : '⊞ 网格'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <SearchBar
          value={filters.keyword}
          onChangeText={(v) => setFilters((prev) => ({ ...prev, keyword: v }))}
          editable
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterBtnText}>🔧 筛选</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        renderItem={renderProduct}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>暂无商品</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : null}
        showsVerticalScrollIndicator={false}
      />

      <FilterPanel
        visible={filterVisible}
        filters={filters}
        onApply={(f) => setFilters((prev) => ({ ...prev, ...f }))}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.xs,
  },
  backBtn: { width: 32, alignItems: 'center' },
  backIcon: { fontSize: 28, color: COLORS.textPrimary, lineHeight: 32 },
  filterBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  filterBtnText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  sortBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sortItem: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  sortItemActive: { borderBottomColor: COLORS.primary },
  sortText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  sortTextActive: { color: COLORS.primary, fontWeight: '600' },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  resultCount: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  viewModeBtn: { fontSize: FONT_SIZES.sm, color: COLORS.primary },
  listContent: { paddingBottom: SPACING.xxxl },
  columnWrapper: { paddingHorizontal: SPACING.sm },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textHint },
});

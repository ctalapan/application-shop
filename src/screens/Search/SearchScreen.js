import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, PRODUCTS, SORT_OPTIONS } from '../../utils/constants';
import { filterProducts } from '../../utils/helpers';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import FilterPanel from '../../components/FilterPanel';

const DEFAULT_FILTERS = {
  category: 'all',
  brand: 'all',
  region: 'all',
  sort: 'default',
  minPrice: '',
  maxPrice: '',
  minOrder: '',
};

export default function SearchScreen({ navigation, route }) {
  const initialKeyword = route.params?.keyword || '';
  const initialCategory = route.params?.category || 'all';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  const results = filterProducts(PRODUCTS, { ...filters, keyword });

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleProductPress = useCallback(
    (product) => navigation.navigate('ProductDetail', { product }),
    [navigation],
  );

  // Build active filter tags
  const activeTags = [];
  if (filters.category !== 'all') {
    activeTags.push({ key: 'category', label: `分类：${filters.category}` });
  }
  if (filters.brand !== 'all') {
    activeTags.push({ key: 'brand', label: `品牌：${filters.brand}` });
  }
  if (filters.region !== 'all') {
    activeTags.push({ key: 'region', label: `地区：${filters.region}` });
  }
  if (filters.minPrice || filters.maxPrice) {
    activeTags.push({
      key: 'price',
      label: `价格：${filters.minPrice || '0'}~${filters.maxPrice || '∞'}`,
    });
  }
  if (filters.minOrder) {
    activeTags.push({ key: 'minOrder', label: `起订≤${filters.minOrder}` });
  }
  if (filters.sort !== 'default') {
    const opt = SORT_OPTIONS.find((s) => s.key === filters.sort);
    if (opt) {
      activeTags.push({ key: 'sort', label: opt.label });
    }
  }

  const removeTag = (key) => {
    const reset = {
      category: 'all',
      brand: 'all',
      region: 'all',
      minPrice: '',
      maxPrice: '',
      minOrder: '',
      sort: 'default',
    };
    if (key === 'price') {
      setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }));
    } else if (reset[key] !== undefined) {
      setFilters((prev) => ({ ...prev, [key]: reset[key] }));
    }
  };

  const renderHeader = () => (
    <View>
      {/* Sort bar */}
      <View style={styles.sortBar}>
        {SORT_OPTIONS.map((opt) => (
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

      {/* Active filter tags */}
      {activeTags.length > 0 && (
        <View style={styles.tagsRow}>
          {activeTags.map((tag) => (
            <TouchableOpacity
              key={tag.key}
              style={styles.activeTag}
              onPress={() => removeTag(tag.key)}
            >
              <Text style={styles.activeTagText}>{tag.label} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Result count */}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>找到 {results.length} 件商品</Text>
        <TouchableOpacity onPress={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}>
          <Text style={styles.viewModeBtn}>{viewMode === 'grid' ? '≡ 列表' : '⊞ 网格'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProduct = ({ item, index }) => {
    if (viewMode === 'grid') {
      return (
        <View style={{ flex: 1, maxWidth: '50%' }}>
          <ProductCard product={item} onPress={handleProductPress} viewMode="grid" />
        </View>
      );
    }
    return <ProductCard product={item} onPress={handleProductPress} viewMode="list" />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <SearchBar value={keyword} onChangeText={setKeyword} onSubmit={() => {}} editable />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterBtnText}>筛选</Text>
          {activeTags.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeTags.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        renderItem={renderProduct}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>没有找到相关商品</Text>
            <Text style={styles.emptyHint}>试试调整搜索条件或筛选器</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : null}
        showsVerticalScrollIndicator={false}
      />

      <FilterPanel
        visible={filterVisible}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  backBtn: {
    width: 32,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textPrimary,
    lineHeight: 32,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    position: 'relative',
  },
  filterBtnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
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
  sortItemActive: {
    borderBottomColor: COLORS.primary,
  },
  sortText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  sortTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activeTag: {
    backgroundColor: '#EAF4FF',
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTagText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  resultCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  viewModeBtn: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textHint,
  },
});

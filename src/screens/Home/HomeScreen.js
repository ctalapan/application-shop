import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, PRODUCTS, CATEGORIES } from '../../utils/constants';
import { filterProducts } from '../../utils/helpers';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';
import FilterPanel from '../../components/FilterPanel';
import { useAppContext } from '../../context/AppContext';

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

export default function HomeScreen({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const { purchaseOrderCount } = useAppContext();

  const products = filterProducts(PRODUCTS, { ...filters, keyword });

  const handleCategorySelect = useCallback((catId) => {
    setFilters((prev) => ({ ...prev, category: catId }));
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleProductPress = useCallback(
    (product) => navigation.navigate('ProductDetail', { product }),
    [navigation],
  );

  const activeFilterCount = [
    filters.category !== 'all',
    filters.brand !== 'all',
    filters.region !== 'all',
    filters.sort !== 'default',
    filters.minPrice !== '',
    filters.maxPrice !== '',
    filters.minOrder !== '',
  ].filter(Boolean).length;

  const renderProduct = ({ item, index }) => (
    <View style={{ flex: 1, maxWidth: '50%' }}>
      <ProductCard product={item} onPress={handleProductPress} viewMode="grid" />
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Hero banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>B2B企业采购平台</Text>
        <Text style={styles.bannerSub}>专业 · 高效 · 可信赖</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          { label: '供应商', value: '5,000+' },
          { label: '商品种类', value: '50万+' },
          { label: '企业客户', value: '10万+' },
          { label: '城市覆盖', value: '300+' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Category filter */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>商品分类</Text>
      </View>
      <CategoryFilter selected={filters.category} onSelect={handleCategorySelect} />

      {/* Products header */}
      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>
          为您推荐{products.length > 0 ? `（${products.length}件）` : ''}
        </Text>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={[styles.filterBtnText, activeFilterCount > 0 && styles.filterBtnTextActive]}>
            筛选{activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>🏪 企采宝</Text>
        </View>
        <View style={styles.searchRow}>
          <SearchBar
            value={keyword}
            onChangeText={setKeyword}
            onSubmit={() => {
              if (keyword.trim()) {
                navigation.navigate('Search', { keyword: keyword.trim() });
              }
            }}
            editable
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              if (keyword.trim()) {
                navigation.navigate('Search', { keyword: keyword.trim() });
              }
            }}
          >
            <Text style={styles.searchBtnText}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>暂无商品</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
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
  appBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoRow: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  logoText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 20,
  },
  searchBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  banner: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    marginBottom: SPACING.xs,
  },
  bannerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xs,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  filterBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF4FF',
  },
  filterBtnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
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
    color: COLORS.textHint,
  },
});

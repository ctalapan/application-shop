import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { getStatusLabel, getStatusColor, formatDate } from '../../utils/helpers';
import OrderCard from '../../components/OrderCard';
import { useAppContext } from '../../context/AppContext';

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'processing', label: '处理中' },
  { key: 'shipped', label: '已发货' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

export default function OrderListScreen({ navigation }) {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredOrders = state.orders.filter(o => {
    const matchStatus = activeTab === 'all' || o.status === activeTab;
    const matchSearch =
      !searchText ||
      o.id.includes(searchText) ||
      o.supplierName.includes(searchText) ||
      o.items.some(i => i.name.includes(searchText));
    return matchStatus && matchSearch;
  });

  const handleOrderPress = useCallback(
    order => navigation.navigate('OrderDetail', { order }),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的订单</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索订单号、供应商、商品"
          placeholderTextColor={COLORS.textHint}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={STATUS_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            const count = item.key === 'all'
              ? state.orders.length
              : state.orders.filter(o => o.status === item.key).length;
            const isActive = activeTab === item.key;
            return (
              <TouchableOpacity
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(item.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {item.label}
                  {count > 0 ? `(${count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.tabsContent}
        />
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderCard order={item} onPress={handleOrderPress} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>暂无订单</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 22,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.xs },
  searchInput: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.textPrimary, padding: 0 },
  clearIcon: { fontSize: 12, color: COLORS.textHint, padding: 4 },
  tabsContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsContent: { paddingHorizontal: SPACING.sm },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontWeight: '600' },
  listContent: { paddingVertical: SPACING.sm, paddingBottom: SPACING.xxxl },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textHint },
});

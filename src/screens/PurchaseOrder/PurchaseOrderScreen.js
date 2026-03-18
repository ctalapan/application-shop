import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { formatPriceFull, formatPrice } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

export default function PurchaseOrderScreen({ navigation }) {
  const {
    state,
    removeFromPurchaseOrder,
    updatePurchaseOrderQty,
    togglePurchaseOrderSelect,
    selectAllPurchaseOrder,
  } = useAppContext();

  const items = state.purchaseOrderItems;
  const selectedItems = items.filter((i) => i.selected);
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const totalAmount = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleDelete = useCallback(
    (ids) => {
      Alert.alert('删除商品', '确定要从采购单中删除选中商品吗？', [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => removeFromPurchaseOrder(ids),
        },
      ]);
    },
    [removeFromPurchaseOrder],
  );

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      Alert.alert('提示', '请先选择要提交的商品');
      return;
    }
    navigation.navigate('Payment', {
      items: selectedItems,
      fromPurchaseOrder: true,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity style={styles.checkbox} onPress={() => togglePurchaseOrderSelect(item.id)}>
        <View style={[styles.checkboxInner, item.selected && styles.checkboxChecked]}>
          {item.selected && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemSupplier}>{item.supplierName}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price, item.unit)}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, item.qty <= item.minOrder && styles.qtyBtnDisabled]}
            onPress={() => updatePurchaseOrderQty(item.id, item.qty - 1)}
            disabled={item.qty <= item.minOrder}
          >
            <Text style={styles.qtyBtnText}>－</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updatePurchaseOrderQty(item.id, item.qty + 1)}
          >
            <Text style={styles.qtyBtnText}>＋</Text>
          </TouchableOpacity>
          <Text style={styles.qtyUnit}>{item.unit}</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete([item.id])}>
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtotal}>小计：{formatPriceFull(item.price * item.qty)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>采购单</Text>
        {selectedItems.length > 0 && (
          <TouchableOpacity onPress={() => handleDelete(selectedItems.map((i) => i.id))}>
            <Text style={styles.deleteSelected}>删除选中</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>采购单为空</Text>
          <Text style={styles.emptyHint}>快去挑选您需要的商品吧！</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>去逛逛</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.selectAllBtn}
              onPress={() => selectAllPurchaseOrder(!allSelected)}
            >
              <View style={[styles.checkboxInner, allSelected && styles.checkboxChecked]}>
                {allSelected && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.selectAllText}>全选</Text>
            </TouchableOpacity>

            <View style={styles.totalSection}>
              <View>
                <Text style={styles.totalLabel}>已选 {selectedItems.length} 件</Text>
                <Text style={styles.totalAmount}>合计：{formatPriceFull(totalAmount)}</Text>
              </View>
              <TouchableOpacity
                style={[styles.submitBtn, selectedItems.length === 0 && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={selectedItems.length === 0}
              >
                <Text style={styles.submitBtnText}>
                  提交采购单
                  {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  deleteSelected: { fontSize: FONT_SIZES.sm, color: COLORS.danger },
  listContent: { paddingVertical: SPACING.sm, paddingBottom: SPACING.xxxl },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
    padding: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    alignItems: 'flex-start',
  },
  checkbox: { marginRight: SPACING.sm, paddingTop: 2 },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkMark: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.sm,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 2,
  },
  itemSupplier: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textHint,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  qtyBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { opacity: 0.4 },
  qtyBtnText: { fontSize: FONT_SIZES.md, color: COLORS.textPrimary },
  qtyValue: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  qtyUnit: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  deleteBtn: { marginLeft: 'auto', padding: 4 },
  deleteBtnText: { fontSize: 18 },
  subtotal: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginRight: SPACING.md,
  },
  selectAllText: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  totalSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  totalAmount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  submitBtnDisabled: { backgroundColor: COLORS.gray },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyHint: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textHint,
    marginBottom: SPACING.xl,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
  },
  shopBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
});

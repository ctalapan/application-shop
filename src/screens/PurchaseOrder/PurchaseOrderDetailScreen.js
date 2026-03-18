import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import {
  formatPriceFull,
  formatPrice,
  getStatusColor,
  getStatusLabel,
  getPaymentStatusLabel,
  getPaymentMethodLabel,
} from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

export default function PurchaseOrderDetailScreen({ navigation, route }) {
  const { order } = route.params || {};
  const { updateOrderStatus } = useAppContext();

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>订单不存在</Text>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(order.status);
  const statusLabel = getStatusLabel(order.status);

  const handleConfirm = () => {
    Alert.alert('确认采购单', '确认后将通知供应商开始备货，是否确认？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: () => {
          updateOrderStatus(order.id, 'processing');
          Alert.alert('成功', '已确认采购单，供应商将开始备货。');
          navigation.goBack();
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('取消采购单', '确定要取消该采购单吗？取消后不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认取消',
        style: 'destructive',
        onPress: () => {
          updateOrderStatus(order.id, 'cancelled');
          navigation.goBack();
        },
      },
    ]);
  };

  const handlePay = () => {
    navigation.navigate('Payment', { order });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>采购单详情</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
          <Text style={styles.statusLabel}>{statusLabel}</Text>
          <Text style={styles.orderId}>{order.id}</Text>
        </View>

        {/* Supplier Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>供应商信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>供应商</Text>
            <Text style={styles.infoValue}>{order.supplierName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>下单时间</Text>
            <Text style={styles.infoValue}>{order.date}</Text>
          </View>
          {order.shippingAddress ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>收货地址</Text>
              <Text style={[styles.infoValue, { flex: 1 }]}>{order.shippingAddress}</Text>
            </View>
          ) : null}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>采购商品</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemDot} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemQty}>
                    × {item.qty} {item.unit}
                  </Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price, item.unit)}</Text>
                </View>
              </View>
              <Text style={styles.itemSubtotal}>{formatPriceFull(item.price * item.qty)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>订单总额</Text>
            <Text style={styles.totalAmount}>{formatPriceFull(order.totalAmount)}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>支付信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>支付方式</Text>
            <Text style={styles.infoValue}>{getPaymentMethodLabel(order.paymentMethod)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>支付状态</Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color: order.paymentStatus === 'paid' ? COLORS.success : COLORS.warning,
                },
              ]}
            >
              {getPaymentStatusLabel(order.paymentStatus)}
            </Text>
          </View>
        </View>

        {/* Note */}
        {order.note ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>备注</Text>
            <Text style={styles.noteText}>{order.note}</Text>
          </View>
        ) : null}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Actions */}
      {order.status === 'pending' && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>取消采购单</Text>
          </TouchableOpacity>
          {order.paymentStatus === 'unpaid' && (
            <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
              <Text style={styles.payBtnText}>立即付款</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>确认采购单</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36 },
  backIcon: { fontSize: 28, color: COLORS.textPrimary },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  errorText: { textAlign: 'center', marginTop: 40, color: COLORS.textHint },
  statusBanner: {
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statusLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  orderId: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: SPACING.xs,
    marginHorizontal: SPACING.md,
    borderRadius: 8,
    padding: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingLeft: SPACING.sm,
  },
  infoRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  infoLabel: {
    width: 80,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  infoValue: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: SPACING.sm,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  itemMeta: { flexDirection: 'row', gap: SPACING.md, marginTop: 4 },
  itemQty: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  itemPrice: { fontSize: FONT_SIZES.xs, color: COLORS.textHint },
  itemSubtotal: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  payBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBE6',
  },
  payBtnText: {
    color: COLORS.warning,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
});

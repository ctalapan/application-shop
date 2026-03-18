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

const TIMELINE = [
  { status: 'pending', label: '订单待确认', icon: '📝' },
  { status: 'processing', label: '处理中/生产中', icon: '⚙️' },
  { status: 'shipped', label: '已发货', icon: '🚚' },
  { status: 'completed', label: '已完成', icon: '✅' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'completed'];

export default function OrderDetailScreen({ navigation, route }) {
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
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  const handleConfirmReceive = () => {
    Alert.alert('确认收货', '确认已收到所有货物吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认收货',
        onPress: () => {
          updateOrderStatus(order.id, 'completed');
          Alert.alert('成功', '已确认收货，订单完成。');
          navigation.goBack();
        },
      },
    ]);
  };

  const handlePay = () => navigation.navigate('Payment', { order });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>订单详情</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
          <Text style={styles.statusEmoji}>
            {order.status === 'completed'
              ? '✅'
              : order.status === 'cancelled'
              ? '❌'
              : order.status === 'shipped'
              ? '🚚'
              : order.status === 'processing'
              ? '⚙️'
              : '📝'}
          </Text>
          <Text style={styles.statusLabel}>{statusLabel}</Text>
          {order.status === 'shipped' && order.trackingNumber && (
            <Text style={styles.trackingNum}>运单号：{order.trackingNumber}</Text>
          )}
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>订单信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单号</Text>
            <Text style={styles.infoValue}>{order.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>下单时间</Text>
            <Text style={styles.infoValue}>{order.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>供应商</Text>
            <Text style={styles.infoValue}>{order.supplierName}</Text>
          </View>
          {order.shippingAddress ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>收货地址</Text>
              <Text style={[styles.infoValue, { flex: 1 }]}>{order.shippingAddress}</Text>
            </View>
          ) : null}
        </View>

        {/* Timeline */}
        {order.status !== 'cancelled' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>物流进度</Text>
            {TIMELINE.map((step, idx) => {
              const isDone = currentIdx >= idx;
              const isCurrent = currentIdx === idx;
              return (
                <View key={step.status} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        isDone ? styles.timelineDotDone : styles.timelineDotPending,
                        isCurrent && styles.timelineDotCurrent,
                      ]}
                    >
                      <Text style={styles.timelineDotIcon}>{isDone ? '✓' : ''}</Text>
                    </View>
                    {idx < TIMELINE.length - 1 && (
                      <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineLabel, isCurrent && styles.timelineLabelCurrent]}>
                      {step.icon} {step.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Logistics */}
        {order.trackingNumber ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>物流信息</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>物流公司</Text>
              <Text style={styles.infoValue}>{order.logisticsCompany}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>运单号</Text>
              <Text style={[styles.infoValue, { color: COLORS.primary }]}>
                {order.trackingNumber}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>订单商品</Text>
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

        {/* Payment */}
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

        {order.note ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>备注</Text>
            <Text style={styles.noteText}>{order.note}</Text>
          </View>
        ) : null}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Actions */}
      <View style={styles.actionBar}>
        {order.status === 'pending' && order.paymentStatus === 'unpaid' && (
          <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
            <Text style={styles.payBtnText}>立即付款</Text>
          </TouchableOpacity>
        )}
        {order.status === 'shipped' && (
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmReceive}>
            <Text style={styles.confirmBtnText}>确认收货</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.chatBtnText}>联系供应商</Text>
        </TouchableOpacity>
      </View>
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
  statusEmoji: { fontSize: 36, marginBottom: SPACING.xs },
  statusLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  trackingNum: {
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
  timelineRow: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: SPACING.md },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotPending: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.lightGray,
  },
  timelineDotDone: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  timelineDotCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  timelineDotIcon: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  timelineLineDone: { backgroundColor: COLORS.primary },
  timelineContent: { flex: 1, paddingBottom: SPACING.md },
  timelineLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  timelineLabelCurrent: { color: COLORS.primary, fontWeight: '600' },
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
  payBtn: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.warning,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
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
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  chatBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
});

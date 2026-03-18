import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { formatPriceFull, getStatusColor, getStatusLabel, formatDate } from '../utils/helpers';

export default function OrderCard({ order, onPress }) {
  const statusColor = getStatusColor(order.status);
  const statusLabel = getStatusLabel(order.status);
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(order)} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderId}>订单号：{order.id}</Text>
        <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.supplier}>{order.supplierName}</Text>

      <View style={styles.itemsSummary}>
        {order.items.slice(0, 2).map((item, idx) => (
          <Text key={idx} style={styles.itemText} numberOfLines={1}>
            · {item.name} x{item.qty}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>共{order.items.length}种商品，{itemCount}件</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(order.date)}</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>合计：</Text>
          <Text style={styles.totalAmount}>{formatPriceFull(order.totalAmount)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderId: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  supplier: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  itemsSummary: {
    marginBottom: SPACING.sm,
  },
  itemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  moreItems: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textHint,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textHint,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
});

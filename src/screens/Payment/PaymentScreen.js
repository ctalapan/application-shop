import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, PAYMENT_METHODS } from '../../utils/constants';
import { formatPriceFull, formatPrice } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

export default function PaymentScreen({ navigation, route }) {
  const { items, order, fromPurchaseOrder } = route.params || {};
  const { submitPurchaseOrder, updateOrderStatus } = useAppContext();

  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');
  const [voucherNote, setVoucherNote] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Compute order details
  const payItems = items || order?.items || [];
  const totalAmount = order?.totalAmount ?? payItems.reduce((s, i) => s + i.price * i.qty, 0);
  const supplierName = order?.supplierName ?? payItems[0]?.supplierName ?? '供应商';

  const BANK_INFO = {
    bankName: '中国工商银行',
    accountName: '深圳科技有限公司',
    accountNumber: '6222 0202 0000 1234 567',
    branch: '深圳市南山区支行',
  };

  const handleConfirmPayment = () => {
    if (!shippingAddress.trim() && fromPurchaseOrder) {
      Alert.alert('提示', '请填写收货地址');
      return;
    }
    if (selectedMethod === 'bank_transfer' && !voucherNote.trim()) {
      Alert.alert('提示', '请填写银行转账的付款凭证号或备注信息');
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);

      if (fromPurchaseOrder && items) {
        submitPurchaseOrder({
          items,
          paymentMethod: selectedMethod,
          shippingAddress,
          note,
        });
      } else if (order) {
        updateOrderStatus(order.id, 'processing');
      }

      Alert.alert(
        '支付成功 🎉',
        `已成功提交付款信息！\n金额：${formatPriceFull(totalAmount)}\n方式：${
          PAYMENT_METHODS.find(m => m.key === selectedMethod)?.label
        }`,
        [
          {
            text: '查看订单',
            onPress: () => {
              navigation.navigate('Orders');
            },
          },
        ],
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>确认支付</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>订单摘要</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>供应商</Text>
            <Text style={styles.infoValue}>{supplierName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>商品数量</Text>
            <Text style={styles.infoValue}>{payItems.length} 种</Text>
          </View>
          {payItems.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemQty}>× {item.qty}</Text>
              <Text style={styles.itemSubtotal}>{formatPriceFull(item.price * item.qty)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>应付金额</Text>
            <Text style={styles.totalAmount}>{formatPriceFull(totalAmount)}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        {fromPurchaseOrder && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>收货地址 *</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="请填写详细收货地址"
              placeholderTextColor={COLORS.textHint}
              value={shippingAddress}
              onChangeText={setShippingAddress}
              multiline
              numberOfLines={2}
            />
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>支付方式</Text>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.key}
              style={[styles.methodItem, selectedMethod === method.key && styles.methodItemActive]}
              onPress={() => setSelectedMethod(method.key)}
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <Text style={[styles.methodLabel, selectedMethod === method.key && styles.methodLabelActive]}>
                {method.label}
              </Text>
              <View style={[styles.radio, selectedMethod === method.key && styles.radioSelected]}>
                {selectedMethod === method.key && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bank Transfer Info */}
        {selectedMethod === 'bank_transfer' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>银行转账信息</Text>
            <View style={styles.bankInfoBox}>
              {Object.entries({
                '开户银行': BANK_INFO.bankName,
                '账户名称': BANK_INFO.accountName,
                '账号': BANK_INFO.accountNumber,
                '开户支行': BANK_INFO.branch,
              }).map(([label, value]) => (
                <View key={label} style={styles.bankRow}>
                  <Text style={styles.bankLabel}>{label}</Text>
                  <Text style={styles.bankValue} selectable>{value}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.voucherLabel}>付款凭证号 / 备注 *</Text>
            <TextInput
              style={styles.voucherInput}
              placeholder="请输入银行流水号或付款备注"
              placeholderTextColor={COLORS.textHint}
              value={voucherNote}
              onChangeText={setVoucherNote}
            />
            <Text style={styles.bankHint}>
              转账完成后请在此填写付款凭证，我们将在1-2个工作日内确认到账。
            </Text>
          </View>
        )}

        {/* Alipay / WeChat Placeholder */}
        {(selectedMethod === 'alipay' || selectedMethod === 'wechat') && (
          <View style={styles.card}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrIcon}>
                {selectedMethod === 'alipay' ? '💙' : '💚'}
              </Text>
              <Text style={styles.qrTitle}>
                {selectedMethod === 'alipay' ? '支付宝' : '微信'}扫码支付
              </Text>
              <View style={styles.qrBox}>
                <Text style={styles.qrText}>扫描二维码完成支付</Text>
                <Text style={styles.qrAmount}>{formatPriceFull(totalAmount)}</Text>
              </View>
              <Text style={styles.qrHint}>二维码有效期 15 分钟</Text>
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>订单备注（选填）</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="如有特殊要求请填写在此..."
            placeholderTextColor={COLORS.textHint}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <View style={styles.footerAmountRow}>
          <Text style={styles.footerLabel}>实付金额：</Text>
          <Text style={styles.footerAmount}>{formatPriceFull(totalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, processing && styles.confirmBtnDisabled]}
          onPress={handleConfirmPayment}
          disabled={processing}
        >
          <Text style={styles.confirmBtnText}>
            {processing ? '处理中...' : '确认付款'}
          </Text>
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
  headerTitle: { flex: 1, fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.textPrimary, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.white,
    margin: SPACING.xs,
    marginHorizontal: SPACING.md,
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.sm,
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
  infoRow: { flexDirection: 'row', marginBottom: SPACING.xs },
  infoLabel: { width: 80, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  itemName: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  itemQty: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginHorizontal: SPACING.sm },
  itemSubtotal: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  totalAmount: { fontSize: FONT_SIZES.xxl, color: COLORS.danger, fontWeight: 'bold' },
  addressInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  methodItemActive: { backgroundColor: '#F0F8FF' },
  methodIcon: { fontSize: 24 },
  methodLabel: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.textPrimary },
  methodLabelActive: { color: COLORS.primary, fontWeight: '600' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  bankInfoBox: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  bankRow: { flexDirection: 'row', marginBottom: SPACING.xs },
  bankLabel: { width: 72, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  bankValue: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: '500' },
  voucherLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: '600', marginBottom: SPACING.xs },
  voucherInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bankHint: { fontSize: FONT_SIZES.xs, color: COLORS.textHint, lineHeight: 18 },
  qrPlaceholder: { alignItems: 'center', paddingVertical: SPACING.xl },
  qrIcon: { fontSize: 40, marginBottom: SPACING.sm },
  qrTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  qrBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    marginBottom: SPACING.md,
  },
  qrText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  qrAmount: { fontSize: FONT_SIZES.xxl, color: COLORS.danger, fontWeight: 'bold' },
  qrHint: { fontSize: FONT_SIZES.xs, color: COLORS.textHint },
  noteInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerAmountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  footerLabel: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  footerAmount: { fontSize: FONT_SIZES.xxl, color: COLORS.danger, fontWeight: 'bold' },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: { backgroundColor: COLORS.gray },
  confirmBtnText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
});

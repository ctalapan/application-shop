import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { formatPrice, formatPriceFull } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { product } = route.params;
  const { addToPurchaseOrder } = useAppContext();

  const [qty, setQty] = useState(product.minOrder);
  const [activeTab, setActiveTab] = useState('desc');
  const [activeImage, setActiveImage] = useState(0);

  const images = product.images || [product.image];

  const handleQtyChange = delta => {
    setQty(prev => Math.max(product.minOrder, prev + delta));
  };

  const handleAddToPurchaseOrder = () => {
    addToPurchaseOrder(product, qty);
    Alert.alert('成功', `已将 ${product.name} x${qty} 加入采购单`, [
      { text: '继续浏览', style: 'cancel' },
      { text: '查看采购单', onPress: () => navigation.navigate('PurchaseOrders') },
    ]);
  };

  const handleInquire = () => {
    Alert.alert('询价', '已向供应商发送询价请求，请在聊天中跟进。');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={e => {
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.mainImage} resizeMode="cover" />
            )}
          />
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Price & Basic Info */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price, product.unit)}</Text>
            {product.tags?.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>品牌：{product.brand}</Text>
            <Text style={styles.metaItem}>起订：{product.minOrder}{product.unit}</Text>
            <Text style={styles.metaItem}>库存：{product.stock}{product.unit}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>销量：{product.sales}{product.unit}</Text>
            <Text style={styles.metaItem}>评分：⭐ {product.rating}</Text>
          </View>
        </View>

        {/* Supplier */}
        <TouchableOpacity style={styles.supplierCard}>
          <View style={styles.supplierLeft}>
            <Text style={styles.supplierIcon}>🏭</Text>
            <View>
              <Text style={styles.supplierName}>{product.supplierName}</Text>
              <Text style={styles.supplierRegion}>📍 {product.region}</Text>
            </View>
          </View>
          <Text style={styles.supplierArrow}>›</Text>
        </TouchableOpacity>

        {/* Quantity Selector */}
        <View style={styles.qtyCard}>
          <Text style={styles.qtyLabel}>采购数量</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, qty <= product.minOrder && styles.qtyBtnDisabled]}
              onPress={() => handleQtyChange(-1)}
              disabled={qty <= product.minOrder}
            >
              <Text style={styles.qtyBtnText}>－</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInput}
              value={String(qty)}
              onChangeText={v => {
                const n = parseInt(v, 10);
                if (!isNaN(n)) setQty(Math.max(product.minOrder, n));
              }}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(1)}>
              <Text style={styles.qtyBtnText}>＋</Text>
            </TouchableOpacity>
            <Text style={styles.qtyUnit}>{product.unit}</Text>
            <Text style={styles.qtyTotal}>合计：{formatPriceFull(product.price * qty)}</Text>
          </View>
          <Text style={styles.minOrderHint}>最低起订量 {product.minOrder} {product.unit}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {[{ key: 'desc', label: '商品详情' }, { key: 'specs', label: '规格参数' }].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'desc' ? (
          <View style={styles.descCard}>
            <Text style={styles.descText}>{product.description}</Text>
          </View>
        ) : (
          <View style={styles.specsCard}>
            {product.specs?.map((spec, i) => (
              <View key={i} style={[styles.specRow, i % 2 === 0 && styles.specRowEven]}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.chatBtn} onPress={handleInquire}>
          <Text style={styles.chatBtnText}>💬 立即询价</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToPurchaseOrder}>
          <Text style={styles.addBtnText}>🛒 加入采购单</Text>
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
  headerTitle: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  shareBtn: { width: 36, alignItems: 'flex-end' },
  shareIcon: { fontSize: 22, color: COLORS.textSecondary },
  imageContainer: { width: SCREEN_WIDTH, height: 280, backgroundColor: COLORS.lightGray },
  mainImage: { width: SCREEN_WIDTH, height: 280 },
  dots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: COLORS.white, width: 14 },
  priceCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  price: { fontSize: FONT_SIZES.xxl, color: COLORS.danger, fontWeight: 'bold' },
  tag: { backgroundColor: '#FFF1F0', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontSize: FONT_SIZES.xs, color: COLORS.danger },
  productName: { fontSize: FONT_SIZES.lg, color: COLORS.textPrimary, fontWeight: '600', marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.xs },
  metaItem: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  supplierCard: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    marginBottom: SPACING.xs,
  },
  supplierLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  supplierIcon: { fontSize: 24 },
  supplierName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  supplierRegion: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  supplierArrow: { fontSize: 22, color: COLORS.textHint },
  qtyCard: { backgroundColor: COLORS.white, padding: SPACING.md, marginBottom: SPACING.xs },
  qtyLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  qtyBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { opacity: 0.4 },
  qtyBtnText: { fontSize: FONT_SIZES.lg, color: COLORS.textPrimary },
  qtyInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  qtyUnit: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  qtyTotal: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.danger, fontWeight: 'bold', textAlign: 'right' },
  minOrderHint: { fontSize: FONT_SIZES.xs, color: COLORS.textHint, marginTop: SPACING.xs },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontWeight: '600' },
  descCard: { backgroundColor: COLORS.white, padding: SPACING.md },
  descText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 24 },
  specsCard: { backgroundColor: COLORS.white },
  specRow: { flexDirection: 'row', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  specRowEven: { backgroundColor: COLORS.lightGray },
  specLabel: { width: 120, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  specValue: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chatBtn: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  addBtn: {
    flex: 2,
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontSize: FONT_SIZES.md, color: COLORS.white, fontWeight: 'bold' },
});

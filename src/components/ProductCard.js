import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { formatPrice } from '../utils/helpers';

export default function ProductCard({ product, onPress, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={() => onPress(product)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: product.image }} style={styles.listImage} />
        <View style={styles.listInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.price}>{formatPrice(product.price, product.unit)}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              起订：{product.minOrder}
              {product.unit}
            </Text>
            <Text style={styles.metaText}>销量：{product.sales}</Text>
          </View>
          <Text style={styles.supplier} numberOfLines={1}>
            {product.supplierName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={() => onPress(product)} activeOpacity={0.7}>
      <Image source={{ uri: product.image }} style={styles.gridImage} />
      <View style={styles.gridInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price, product.unit)}</Text>
        <Text style={styles.minOrder}>
          起订：{product.minOrder}
          {product.unit}
        </Text>
        <Text style={styles.supplier} numberOfLines={1}>
          {product.supplierName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid mode
  gridCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    margin: 4,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  gridImage: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.lightGray,
  },
  gridInfo: {
    padding: SPACING.sm,
  },
  // List mode
  listCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    padding: SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
  },
  listInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
    justifyContent: 'space-between',
  },
  // Shared
  productName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 2,
  },
  brand: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textHint,
    marginBottom: 2,
  },
  price: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  minOrder: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textHint,
  },
  supplier: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textHint,
  },
});

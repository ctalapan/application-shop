import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { useAppContext } from '../../context/AppContext';

const MENU_ITEMS = [
  { id: 'account', icon: '👤', label: '账号信息', desc: '查看和修改账号信息' },
  { id: 'company', icon: '🏢', label: '企业信息', desc: '营业执照、税号等信息' },
  { id: 'address', icon: '📍', label: '地址管理', desc: '收货地址管理' },
  { id: 'invoice', icon: '🧾', label: '发票管理', desc: '发票抬头、增值税发票' },
  { id: 'orders_stats', icon: '📊', label: '采购统计', desc: '采购金额、商品统计' },
  { id: 'settings', icon: '⚙️', label: '设置', desc: '通知、隐私、语言设置' },
  { id: 'help', icon: '❓', label: '帮助中心', desc: '常见问题解答' },
  { id: 'about', icon: 'ℹ️', label: '关于我们', desc: '版本信息、联系方式' },
];

export default function ProfileScreen({ navigation }) {
  const { state } = useAppContext();
  const user = state.user;

  const completedOrders = state.orders.filter(o => o.status === 'completed').length;
  const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
  const processingOrders = state.orders.filter(o => o.status === 'processing').length;
  const totalSpend = state.orders
    .filter(o => o.status === 'completed')
    .reduce((s, o) => s + o.totalAmount, 0);

  const handleMenuPress = item => {
    Alert.alert(item.label, `${item.desc}\n（功能开发中）`);
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '退出', style: 'destructive', onPress: () => Alert.alert('提示', '已退出登录') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
        <TouchableOpacity onPress={() => Alert.alert('扫一扫', '扫码功能需要真机运行')}>
          <Text style={styles.scanIcon}>⊡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberText}>💎 {user.memberLevel}</Text>
              </View>
            </View>
            <Text style={styles.company}>{user.company}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('编辑资料', '功能开发中')}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.statValue}>{pendingOrders}</Text>
            <Text style={styles.statLabel}>待确认</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.statValue}>{processingOrders}</Text>
            <Text style={styles.statLabel}>处理中</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.statValue}>{completedOrders}</Text>
            <Text style={styles.statLabel}>已完成</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statValue}>
              {totalSpend >= 10000 ? `${(totalSpend / 10000).toFixed(1)}万` : totalSpend}
            </Text>
            <Text style={styles.statLabel}>总采购额</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: '🛒', label: '采购单', action: () => navigation.navigate('PurchaseOrders') },
              { icon: '📋', label: '我的订单', action: () => navigation.navigate('Orders') },
              { icon: '💬', label: '消息中心', action: () => navigation.navigate('Chat') },
              { icon: '⭐', label: '收藏商品', action: () => Alert.alert('提示', '功能开发中') },
              { icon: '🔔', label: '消息通知', action: () => Alert.alert('提示', '功能开发中') },
              { icon: '🎁', label: '优惠活动', action: () => Alert.alert('提示', '功能开发中') },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.quickItem} onPress={item.action}>
                <Text style={styles.quickIcon}>{item.icon}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, idx < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <Text style={styles.version}>企采宝 v1.0.0 · B2B企业采购平台</Text>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  scanIcon: { fontSize: 22, color: COLORS.textSecondary },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.md,
  },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 },
  userName: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  memberBadge: { backgroundColor: '#FFF8E1', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  memberText: { fontSize: FONT_SIZES.xs, color: '#F59E0B', fontWeight: '600' },
  company: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 2 },
  role: { fontSize: FONT_SIZES.xs, color: COLORS.textHint },
  editIcon: { fontSize: 20, padding: SPACING.xs },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  quickActions: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
  },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.md },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  quickItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  quickIcon: { fontSize: 28, marginBottom: 6 },
  quickLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  menuCard: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: FONT_SIZES.md, color: COLORS.textPrimary, fontWeight: '500' },
  menuDesc: { fontSize: FONT_SIZES.xs, color: COLORS.textHint, marginTop: 2 },
  menuArrow: { fontSize: 22, color: COLORS.textHint },
  logoutBtn: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    marginTop: 0,
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: { color: COLORS.danger, fontSize: FONT_SIZES.md, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: FONT_SIZES.xs, color: COLORS.textHint, marginBottom: SPACING.sm },
});

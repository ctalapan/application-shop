import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { COLORS } from '../utils/constants';
import { formatBadgeCount } from '../utils/helpers';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import ProductListScreen from '../screens/Product/ProductListScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import PurchaseOrderScreen from '../screens/PurchaseOrder/PurchaseOrderScreen';
import PurchaseOrderDetailScreen from '../screens/PurchaseOrder/PurchaseOrderDetailScreen';
import OrderListScreen from '../screens/Order/OrderListScreen';
import OrderDetailScreen from '../screens/Order/OrderDetailScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatDetailScreen from '../screens/Chat/ChatDetailScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab Icon ─────────────────────────────────
function TabIcon({ emoji, focused, badge }) {
  return (
    <View style={styles.tabIconWrapper}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>{emoji}</Text>
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatBadgeCount(badge)}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Home Stack ───────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

// ─── Purchase Order Stack ─────────────────────
function PurchaseOrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PurchaseOrderMain" component={PurchaseOrderScreen} />
      <Stack.Screen name="PurchaseOrderDetail" component={PurchaseOrderDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

// ─── Order Stack ──────────────────────────────
function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

// ─── Chat Stack ───────────────────────────────
function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

// ─── Profile Stack ────────────────────────────
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// ─── Bottom Tab Navigator ─────────────────────
export default function AppNavigator() {
  const { purchaseOrderCount, totalUnread } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStack}
        options={{
          tabBarLabel: '订单',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PurchaseOrders"
        component={PurchaseOrderStack}
        options={{
          tabBarLabel: '采购单',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛒" focused={focused} badge={purchaseOrderCount} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarLabel: '聊天',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} badge={totalUnread} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 4,
    paddingBottom: 4,
    height: 60,
  },
  tabLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  tabIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.65,
  },
  tabEmojiFocused: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

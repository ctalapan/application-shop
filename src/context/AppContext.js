import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ORDERS, CHAT_CONVERSATIONS, CURRENT_USER, PRODUCTS } from '../utils/constants';
import { generateId } from '../utils/helpers';

const AppContext = createContext(null);

// ─── Initial State ─────────────────────────────
const initialState = {
  user: CURRENT_USER,
  // purchase order cart items
  purchaseOrderItems: [],
  // placed orders
  orders: ORDERS,
  // chat conversations
  conversations: CHAT_CONVERSATIONS,
  // products (for quick lookup)
  products: PRODUCTS,
};

// ─── Action Types ──────────────────────────────
export const ACTIONS = {
  // Purchase order
  ADD_TO_PURCHASE_ORDER: 'ADD_TO_PURCHASE_ORDER',
  REMOVE_FROM_PURCHASE_ORDER: 'REMOVE_FROM_PURCHASE_ORDER',
  UPDATE_PURCHASE_ORDER_QTY: 'UPDATE_PURCHASE_ORDER_QTY',
  TOGGLE_PURCHASE_ORDER_SELECT: 'TOGGLE_PURCHASE_ORDER_SELECT',
  SELECT_ALL_PURCHASE_ORDER: 'SELECT_ALL_PURCHASE_ORDER',
  CLEAR_SELECTED_PURCHASE_ORDER: 'CLEAR_SELECTED_PURCHASE_ORDER',
  SUBMIT_PURCHASE_ORDER: 'SUBMIT_PURCHASE_ORDER',
  // Orders
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  // Chat
  SEND_MESSAGE: 'SEND_MESSAGE',
  MARK_CONVERSATION_READ: 'MARK_CONVERSATION_READ',
  // User
  UPDATE_USER: 'UPDATE_USER',
};

// ─── Reducer ───────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_PURCHASE_ORDER: {
      const { product, qty } = action.payload;
      const existing = state.purchaseOrderItems.find(i => i.productId === product.id);
      if (existing) {
        return {
          ...state,
          purchaseOrderItems: state.purchaseOrderItems.map(i =>
            i.productId === product.id ? { ...i, qty: i.qty + qty } : i,
          ),
        };
      }
      return {
        ...state,
        purchaseOrderItems: [
          ...state.purchaseOrderItems,
          {
            id: generateId('poi'),
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            unit: product.unit,
            minOrder: product.minOrder,
            supplierId: product.supplierId,
            supplierName: product.supplierName,
            qty,
            selected: true,
          },
        ],
      };
    }

    case ACTIONS.REMOVE_FROM_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrderItems: state.purchaseOrderItems.filter(
          i => !action.payload.ids.includes(i.id),
        ),
      };

    case ACTIONS.UPDATE_PURCHASE_ORDER_QTY:
      return {
        ...state,
        purchaseOrderItems: state.purchaseOrderItems.map(i =>
          i.id === action.payload.id ? { ...i, qty: Math.max(i.minOrder, action.payload.qty) } : i,
        ),
      };

    case ACTIONS.TOGGLE_PURCHASE_ORDER_SELECT:
      return {
        ...state,
        purchaseOrderItems: state.purchaseOrderItems.map(i =>
          i.id === action.payload.id ? { ...i, selected: !i.selected } : i,
        ),
      };

    case ACTIONS.SELECT_ALL_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrderItems: state.purchaseOrderItems.map(i => ({
          ...i,
          selected: action.payload.selected,
        })),
      };

    case ACTIONS.SUBMIT_PURCHASE_ORDER: {
      const { items, paymentMethod, shippingAddress, note } = action.payload;
      const newOrder = {
        id: `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        supplierId: items[0]?.supplierId || '',
        supplierName: items[0]?.supplierName || '',
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          price: i.price,
          unit: i.unit,
        })),
        totalAmount: items.reduce((s, i) => s + i.price * i.qty, 0),
        paymentMethod: paymentMethod || 'bank_transfer',
        paymentStatus: 'unpaid',
        shippingAddress: shippingAddress || '',
        trackingNumber: '',
        logisticsCompany: '',
        note: note || '',
      };
      const submittedIds = items.map(i => i.id);
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        purchaseOrderItems: state.purchaseOrderItems.filter(i => !submittedIds.includes(i.id)),
      };
    }

    case ACTIONS.ADD_ORDER:
      return { ...state, orders: [action.payload, ...state.orders] };

    case ACTIONS.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o,
        ),
      };

    case ACTIONS.SEND_MESSAGE: {
      const { conversationId, message } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map(c => {
          if (c.id !== conversationId) return c;
          const newMsg = {
            id: generateId('msg'),
            senderId: 'user',
            text: message,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
          };
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: message,
            lastMessageTime: newMsg.time,
          };
        }),
      };
    }

    case ACTIONS.MARK_CONVERSATION_READ:
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.payload.conversationId ? { ...c, unreadCount: 0 } : c,
        ),
      };

    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToPurchaseOrder = useCallback((product, qty) => {
    dispatch({ type: ACTIONS.ADD_TO_PURCHASE_ORDER, payload: { product, qty } });
  }, []);

  const removeFromPurchaseOrder = useCallback(ids => {
    dispatch({ type: ACTIONS.REMOVE_FROM_PURCHASE_ORDER, payload: { ids } });
  }, []);

  const updatePurchaseOrderQty = useCallback((id, qty) => {
    dispatch({ type: ACTIONS.UPDATE_PURCHASE_ORDER_QTY, payload: { id, qty } });
  }, []);

  const togglePurchaseOrderSelect = useCallback(id => {
    dispatch({ type: ACTIONS.TOGGLE_PURCHASE_ORDER_SELECT, payload: { id } });
  }, []);

  const selectAllPurchaseOrder = useCallback(selected => {
    dispatch({ type: ACTIONS.SELECT_ALL_PURCHASE_ORDER, payload: { selected } });
  }, []);

  const submitPurchaseOrder = useCallback(payload => {
    dispatch({ type: ACTIONS.SUBMIT_PURCHASE_ORDER, payload });
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    dispatch({ type: ACTIONS.UPDATE_ORDER_STATUS, payload: { id, status } });
  }, []);

  const sendMessage = useCallback((conversationId, message) => {
    dispatch({ type: ACTIONS.SEND_MESSAGE, payload: { conversationId, message } });
  }, []);

  const markConversationRead = useCallback(conversationId => {
    dispatch({ type: ACTIONS.MARK_CONVERSATION_READ, payload: { conversationId } });
  }, []);

  const updateUser = useCallback(data => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: data });
  }, []);

  const purchaseOrderCount = state.purchaseOrderItems.length;
  const totalUnread = state.conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        // actions
        addToPurchaseOrder,
        removeFromPurchaseOrder,
        updatePurchaseOrderQty,
        togglePurchaseOrderSelect,
        selectAllPurchaseOrder,
        submitPurchaseOrder,
        updateOrderStatus,
        sendMessage,
        markConversationRead,
        updateUser,
        // derived
        purchaseOrderCount,
        totalUnread,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

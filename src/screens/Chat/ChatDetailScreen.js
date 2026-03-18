import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, CURRENT_USER } from '../../utils/constants';
import { useAppContext } from '../../context/AppContext';

export default function ChatDetailScreen({ navigation, route }) {
  const { conversation } = route.params || {};
  const { sendMessage, markConversationRead, state } = useAppContext();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // Get latest conversation from state
  const currentConversation =
    state.conversations.find((c) => c.id === conversation?.id) || conversation;
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    if (conversation?.id) {
      markConversationRead(conversation.id);
    }
  }, [conversation?.id, markConversationRead]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !conversation?.id) {
      return;
    }
    sendMessage(conversation.id, text);
    setInputText('');
  };

  const handleAttach = () => {
    Alert.alert('发送图片', '选择图片发送方式', [
      {
        text: '拍照',
        onPress: () => Alert.alert('提示', '相机功能需要真机运行'),
      },
      {
        text: '从相册选择',
        onPress: () => Alert.alert('提示', '相册功能需要真机运行'),
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleShareProduct = () => {
    Alert.alert('分享商品', '选择要分享的商品', [{ text: '取消', style: 'cancel' }]);
  };

  const isUser = (senderId) => senderId === 'user' || senderId === CURRENT_USER.id;

  const renderMessage = ({ item }) => {
    const fromUser = isUser(item.senderId);

    return (
      <View style={[styles.messageRow, fromUser ? styles.messageRowRight : styles.messageRowLeft]}>
        {!fromUser && (
          <Image source={{ uri: currentConversation?.supplierAvatar }} style={styles.msgAvatar} />
        )}

        <View style={styles.bubbleWrapper}>
          <View style={[styles.bubble, fromUser ? styles.bubbleUser : styles.bubbleSupplier]}>
            {item.type === 'product' ? (
              <View style={styles.productCard}>
                <Text style={styles.productCardLabel}>📦 商品分享</Text>
                <Text style={styles.productCardName}>{item.productName}</Text>
                <Text style={styles.productCardPrice}>{item.productPrice}</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.bubbleText,
                  fromUser ? styles.bubbleTextUser : styles.bubbleTextSupplier,
                ]}
              >
                {item.text}
              </Text>
            )}
          </View>
          <Text style={[styles.msgTime, fromUser ? styles.msgTimeRight : styles.msgTimeLeft]}>
            {item.time}
          </Text>
        </View>

        {fromUser && <Image source={{ uri: CURRENT_USER.avatar }} style={styles.msgAvatar} />}
      </View>
    );
  };

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>会话不存在</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{currentConversation.supplierName}</Text>
          <Text style={styles.headerSub}>在线</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} onPress={handleShareProduct}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Quick Replies */}
        <View style={styles.quickReplies}>
          {['请问有货吗？', '能否优惠？', '最快几天发货？'].map((text) => (
            <TouchableOpacity
              key={text}
              style={styles.quickReply}
              onPress={() => setInputText(text)}
            >
              <Text style={styles.quickReplyText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn} onPress={handleAttach}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="输入消息..."
            placeholderTextColor={COLORS.textHint}
            multiline
            maxLength={500}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendBtnText}>发送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerSub: { fontSize: FONT_SIZES.xs, color: COLORS.success },
  moreBtn: { width: 36, alignItems: 'flex-end' },
  moreIcon: { fontSize: 22, color: COLORS.textSecondary },
  errorText: { textAlign: 'center', marginTop: 40, color: COLORS.textHint },
  messagesList: { padding: SPACING.md, paddingBottom: SPACING.xl },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
  msgAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.xs,
  },
  bubbleWrapper: { maxWidth: '70%' },
  bubble: {
    borderRadius: 12,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  bubbleSupplier: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bubbleText: { fontSize: FONT_SIZES.md, lineHeight: 22 },
  bubbleTextUser: { color: COLORS.white },
  bubbleTextSupplier: { color: COLORS.textPrimary },
  msgTime: { fontSize: FONT_SIZES.xs, color: COLORS.textHint, marginTop: 4 },
  msgTimeLeft: { textAlign: 'left', marginLeft: 4 },
  msgTimeRight: { textAlign: 'right', marginRight: 4 },
  productCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    padding: SPACING.sm,
    minWidth: 160,
  },
  productCardLabel: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  productCardName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '600',
  },
  productCardPrice: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  quickReplies: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.white,
    gap: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickReply: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  quickReplyText: { fontSize: FONT_SIZES.xs, color: COLORS.primary },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.xs,
  },
  attachBtn: { padding: SPACING.xs },
  attachIcon: { fontSize: 22 },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.gray },
  sendBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
});

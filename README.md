# B2B企业采购商城 (B2B Shopping Mall App)

A comprehensive B2B (Business-to-Business) shopping mall mobile application built with React Native.

## 功能特性 (Features)

### 1. 多条件筛选搜索 (Multi-condition Filter Search)
- 关键词搜索 (Keyword search)
- 分类筛选 (Category filter)
- 价格区间 (Price range)
- 品牌筛选 (Brand filter)
- 起订量筛选 (Minimum order quantity filter)
- 地区/供应商筛选 (Region/supplier filter)
- 多种排序方式: 综合/价格/销量 (Sort: default/price/sales)
- 激活筛选标签显示 (Active filter tag chips display)

### 2. 采购单 (Purchase Order)
- 商品加入采购单 (Add products to purchase order)
- 批量选择/取消选择 (Batch select/deselect items)
- 商品数量调整 (Quantity adjustment)
- 删除采购单商品 (Delete items from purchase order)
- 采购单总价计算 (Total price calculation)
- 提交采购单 (Submit purchase order)
- 采购单详情查看 (Purchase order detail view)
- 状态跟踪 (Status tracking)

### 3. 订单管理 (Order Management)
- 多状态订单列表: 全部/待确认/处理中/已完成/已取消 (Order list with status tabs)
- 订单搜索 (Order search)
- 订单详情 (Order detail)
- 物流信息 (Logistics information)
- 付款信息 (Payment information)
- 订单状态时间线 (Order status timeline)
- 订单操作按钮 (Order action buttons based on status)

### 4. 支付 (Payment)
- 多种支付方式 (Multiple payment methods):
  - 银行转账 (Bank transfer)
  - 支付宝 (Alipay)
  - 微信支付 (WeChat Pay)
- 支付金额确认 (Payment amount confirmation)
- 银行转账凭证上传 (Payment voucher upload for bank transfer)
- 支付结果反馈 (Payment result feedback)

### 5. 聊天 (Chat)
- 聊天会话列表 (Chat conversation list)
- 未读消息数角标 (Unread message badge count)
- 对话搜索 (Conversation search)
- 实时消息界面 (Real-time chat UI with bubbles)
- 发送文本消息 (Send text messages)
- 图片附件发送 (Image attachment sending)
- 时间戳显示 (Timestamp display)
- 聊天中商品卡片分享 (Product card sharing in chat)
- 快捷回复功能 (Quick reply feature)

## 技术栈 (Tech Stack)

- **React Native** 0.73.0
- **React Navigation** 6.x (Bottom Tabs + Native Stack)
- **React Native Paper** 5.x (Material Design UI)
- **React Native Safe Area Context** 4.x
- **React Native Screens** 3.x
- **React Native Vector Icons** 10.x
- **AsyncStorage** (local data persistence)
- **Context API + useReducer** (state management)

## 项目结构 (Project Structure)

```
B2BShopMall/
├── App.js                          # 应用入口
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js         # 导航配置（底部Tab + Stack）
│   ├── context/
│   │   └── AppContext.js           # 全局状态管理
│   ├── screens/
│   │   ├── Home/
│   │   │   └── HomeScreen.js       # 首页
│   │   ├── Search/
│   │   │   └── SearchScreen.js     # 多条件筛选搜索页
│   │   ├── Product/
│   │   │   ├── ProductListScreen.js  # 商品列表
│   │   │   └── ProductDetailScreen.js # 商品详情
│   │   ├── PurchaseOrder/
│   │   │   ├── PurchaseOrderScreen.js      # 采购单
│   │   │   └── PurchaseOrderDetailScreen.js # 采购单详情
│   │   ├── Order/
│   │   │   ├── OrderListScreen.js    # 订单列表
│   │   │   └── OrderDetailScreen.js  # 订单详情
│   │   ├── Payment/
│   │   │   └── PaymentScreen.js     # 支付页面
│   │   ├── Chat/
│   │   │   ├── ChatListScreen.js    # 聊天列表
│   │   │   └── ChatDetailScreen.js  # 聊天详情
│   │   └── Profile/
│   │       └── ProfileScreen.js    # 个人中心
│   ├── components/
│   │   ├── ProductCard.js          # 商品卡片组件
│   │   ├── OrderCard.js            # 订单卡片组件
│   │   ├── FilterPanel.js          # 筛选面板组件
│   │   ├── SearchBar.js            # 搜索栏组件
│   │   └── CategoryFilter.js      # 分类筛选组件
│   └── utils/
│       ├── constants.js            # 常量与Mock数据
│       └── helpers.js             # 工具函数
```

## 快速开始 (Getting Started)

### 环境要求 (Prerequisites)
- Node.js >= 18
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)

### 安装依赖 (Install dependencies)
```bash
npm install
```

### 运行应用 (Run the app)
```bash
# Android
npx react-native run-android

# iOS
cd ios && pod install
npx react-native run-ios
```

### 启动Metro开发服务器 (Start Metro Bundler)
```bash
npx react-native start
```

## 界面截图 (App Screens)

| 首页 | 多条件搜索 | 商品详情 |
|------|-----------|---------|
| 采购单 | 订单管理 | 支付 |
| 聊天列表 | 聊天界面 | 个人中心 |

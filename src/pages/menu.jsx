// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Minus, ShoppingCart, Flame, UtensilsCrossed, Coffee, Loader2, MapPin, CheckCircle } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { OrderDetailDialog } from '@/components/OrderDetailDialog';

// 初始商品数据
const initialProducts = [{
  name: '羊肉串',
  price: 5,
  description: '新鲜羊肉，秘制腌制',
  category: '肉类',
  image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
  hot: true,
  stock: 100
}, {
  name: '牛肉串',
  price: 6,
  description: '精选牛肉，鲜嫩多汁',
  category: '肉类',
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  hot: true,
  stock: 80
}, {
  name: '鸡翅中',
  price: 4,
  description: '奥尔良风味，外酥里嫩',
  category: '肉类',
  image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
  hot: false,
  stock: 60
}, {
  name: '烤茄子',
  price: 8,
  description: '蒜蓉烤制，香辣可口',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  hot: true,
  stock: 40
}, {
  name: '烤韭菜',
  price: 6,
  description: '新鲜韭菜，蒜香浓郁',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
  hot: false,
  stock: 50
}, {
  name: '烤玉米',
  price: 5,
  description: '甜玉米，刷酱烤制',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
  hot: false,
  stock: 45
}, {
  name: '烤馒头片',
  price: 3,
  description: '外酥里软，刷甜面酱',
  category: '主食',
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  hot: false,
  stock: 70
}, {
  name: '烤红薯',
  price: 8,
  description: '蜜薯烤制，香甜软糯',
  category: '主食',
  image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  hot: true,
  stock: 30
}, {
  name: '烤金针菇',
  price: 6,
  description: '蒜蓉烤制，口感爽脆',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
  hot: false,
  stock: 55
}, {
  name: '烤生蚝',
  price: 12,
  description: '蒜蓉粉丝，鲜美无比',
  category: '海鲜',
  image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
  hot: true,
  stock: 25
}, {
  name: '烤鱿鱼',
  price: 15,
  description: '铁板鱿鱼，香辣过瘾',
  category: '海鲜',
  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  hot: false,
  stock: 20
}, {
  name: '烤大虾',
  price: 18,
  description: '新鲜大虾，蒜蓉烤制',
  category: '海鲜',
  image: 'https://images.unsplash.com/photo-1623689046286-01aae5144820?w=400&h=300&fit=crop',
  hot: true,
  stock: 15
}];

// 初始桌号列表
const initialTables = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15'];

// 购物车组件
function CartSheet({
  cart,
  onAdd,
  onRemove,
  onSubmit,
  totalItems,
  totalPrice,
  children
}) {
  return <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-[#FF5722]" />
            购物车
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
          {cart.length === 0 ? <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Coffee className="w-16 h-16 mb-4" />
              <p>购物车是空的</p>
              <p className="text-sm">快去选择您喜欢的菜品吧</p>
            </div> : <>
              <div className="flex-1 overflow-y-auto space-y-3">
                {cart.map(cartItem => <div key={cartItem.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img src={cartItem.image} alt={cartItem.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#333333]">{cartItem.name}</h4>
                      <p className="text-[#FF5722] font-mono font-bold">
                        ¥{cartItem.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => onRemove(cartItem._id || cartItem.id)} className="h-8 w-8 p-0">
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-mono font-bold">
                        {cartItem.quantity}
                      </span>
                      <Button size="sm" onClick={() => onAdd(cartItem)} className="h-8 w-8 p-0 bg-[#FF5722] hover:bg-[#E64A19]">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>)}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">合计</span>
                  <span className="text-2xl font-bold text-[#FF5722] font-mono">
                    ¥{totalPrice}
                  </span>
                </div>
                <Button onClick={onSubmit} className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white h-12 text-lg">
                  提交订单
                </Button>
              </div>
            </>}
        </div>
      </SheetContent>
    </Sheet>;
}
export default function MenuPage(props) {
  const {
    toast
  } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [useLocalData, setUseLocalData] = useState(false);
  const [selectedTable, setSelectedTable] = useState('A01');
  const [tables, setTables] = useState(initialTables);
  const [lastOrder, setLastOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [tableFromUrl, setTableFromUrl] = useState(false);
  const categories = ['全部', '肉类', '蔬菜', '海鲜', '主食'];

  // 加载商品数据
  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'restaurant_product',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (result && result.records) {
        setMenuItems(result.records);
      }
    } catch (error) {
      console.error('加载商品失败:', error);
      // 如果数据库不存在或查询失败，使用本地数据
      console.log('使用本地数据');
      setMenuItems(initialProducts);
      setUseLocalData(true);
      toast({
        title: '使用本地数据',
        description: '数据库连接失败，已切换到本地数据模式',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };

  // 从 URL 参数中读取桌号
  useEffect(() => {
    const urlParams = props.$w.page.dataset.params;
    if (urlParams && urlParams.table) {
      const tableParam = urlParams.table.toUpperCase();
      // 验证桌号格式（A01-A15）
      const isValidTable = /^A(0[1-9]|1[0-5])$/.test(tableParam);
      if (isValidTable) {
        setSelectedTable(tableParam);
        setTableFromUrl(true);
        toast({
          title: '已自动选择桌号',
          description: `当前桌号: ${tableParam}`,
          variant: 'default'
        });
      } else {
        toast({
          title: '桌号格式错误',
          description: '桌号应为 A01-A15 格式，已使用默认桌号 A01',
          variant: 'destructive'
        });
      }
    }
  }, []);

  // 加载商品数据
  useEffect(() => {
    loadProducts();
  }, []);

  // 筛选菜品
  const filteredItems = selectedCategory === '全部' ? menuItems : menuItems.filter(item => item.category === selectedCategory);

  // 添加到购物车
  const addToCart = item => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => (cartItem._id || cartItem.id) === (item._id || item.id));
      if (existingItem) {
        return prevCart.map(cartItem => (cartItem._id || cartItem.id) === (item._id || item.id) ? {
          ...cartItem,
          quantity: cartItem.quantity + 1
        } : cartItem);
      }
      return [...prevCart, {
        ...item,
        quantity: 1
      }];
    });
    toast({
      title: '已添加',
      description: `${item.name} 已加入购物车`
    });
  };

  // 从购物车移除
  const removeFromCart = itemId => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => (cartItem._id || cartItem.id) === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem => (cartItem._id || cartItem.id) === itemId ? {
          ...cartItem,
          quantity: cartItem.quantity - 1
        } : cartItem);
      }
      return prevCart.filter(cartItem => (cartItem._id || cartItem.id) !== itemId);
    });
  };

  // 计算总价
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 提交订单
  const submitOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: '购物车为空',
        description: '请先选择菜品',
        variant: 'destructive'
      });
      return;
    }
    try {
      setSubmitting(true);
      const orderNo = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const orderData = {
        orderNo: orderNo,
        tableNumber: selectedTable,
        items: cart.map(item => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        status: 'pending',
        remark: ''
      };
      await props.$w.cloud.callDataSource({
        dataSourceName: 'restaurant_order',
        methodName: 'wedaCreateV2',
        params: {
          data: orderData
        }
      });
      // 保存订单信息用于显示详情
      setLastOrder({
        ...orderData,
        createdAt: new Date().toISOString()
      });
      setShowOrderDetail(true);
      setCart([]);
      toast({
        title: '订单已提交',
        description: `订单号: ${orderNo}，共 ${totalItems} 件商品，总价 ¥${totalPrice}`
      });
    } catch (error) {
      console.error('提交订单失败:', error);
      toast({
        title: '提交失败',
        description: error.message || '订单提交失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-[#FAFAFA]">
      {/* 顶部导航 */}
      <header className="bg-[#1A1A1A] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-[#FF5722]" />
              <div>
                <h1 className="text-2xl font-bold font-mono">烧烤点餐系统</h1>
                <p className="text-xs text-gray-400">扫码点餐 · 即时下单</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* 桌号选择 */}
              <div className="flex items-center gap-2 bg-[#333] px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-[#FF5722]" />
                <Select value={selectedTable} onValueChange={setSelectedTable} disabled={tableFromUrl}>
                  <SelectTrigger className={`w-24 bg-transparent border-0 text-white focus:ring-0 ${tableFromUrl ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map(table => <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 购物车按钮 */}
              <CartSheet cart={cart} onAdd={addToCart} onRemove={removeFromCart} onSubmit={submitOrder} totalItems={totalItems} totalPrice={totalPrice}>
                <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && <Badge className="absolute -top-2 -right-2 bg-white text-[#FF5722] font-bold">
                      {totalItems}
                    </Badge>}
                </Button>
              </CartSheet>
            </div>
          </div>
        </div>
      </header>

      {/* 分类筛选 */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === category ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {category}
              </button>)}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-[#FF5722] animate-spin" />
          </div> : <>
            {/* URL 桌号提示 */}
            {tableFromUrl && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>已通过二维码自动选择桌号: <strong>{selectedTable}</strong></span>
              </div>}

            {/* 数据模式标识 */}
            {useLocalData && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                ⚠️ 当前使用本地数据模式
              </div>}

            {/* 菜品列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => <div key={item._id || item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                  <div className="relative">
                    <img src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'} alt={item.name} className="w-full h-48 object-cover" />
                    {item.hot && <Badge className="absolute top-2 left-2 bg-[#FF5722] text-white">
                        <Flame className="w-3 h-3 mr-1" />
                        热销
                      </Badge>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-[#333333]">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#FF5722] font-mono">
                        ¥{item.price}
                      </span>
                      <Button onClick={() => addToCart(item)} className="bg-[#FF5722] hover:bg-[#E64A19] text-white">
                        <Plus className="w-4 h-4 mr-1" />
                        添加
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>

            {/* 空状态 */}
            {filteredItems.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Coffee className="w-16 h-16 mb-4" />
                <p className="text-lg">暂无菜品</p>
                <p className="text-sm">该分类下还没有菜品</p>
              </div>}
          </>}
      </main>

      {/* 订单详情弹窗 */}
      <OrderDetailDialog order={lastOrder} open={showOrderDetail} onOpenChange={setShowOrderDetail} />

    </div>;
}
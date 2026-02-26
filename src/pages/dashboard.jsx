// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Package, DollarSign, TrendingUp, Loader2, RefreshCw, Settings, ShoppingBag, BarChart3, LogOut, User, UtensilsCrossed, Search, Plus, MapPin, Clock, Eye, Trash2 } from 'lucide-react';
// @ts-ignore;
import { Button, useToast, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';

import { ProductForm } from '@/components/ProductForm';
import { ProductTable } from '@/components/ProductTable';
import { CategoryManager } from '@/components/CategoryManager';
import { TableManager } from '@/components/TableManager';
import { OrderDetailDialog } from '@/components/OrderDetailDialog';

// 初始商品数据
const initialProducts = [{
  _id: '1',
  name: '羊肉串',
  price: 5,
  description: '新鲜羊肉，秘制腌制',
  category: '肉类',
  image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
  hot: true,
  stock: 100
}, {
  _id: '2',
  name: '牛肉串',
  price: 6,
  description: '精选牛肉，鲜嫩多汁',
  category: '肉类',
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  hot: true,
  stock: 80
}, {
  _id: '3',
  name: '鸡翅中',
  price: 4,
  description: '奥尔良风味，外酥里嫩',
  category: '肉类',
  image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
  hot: false,
  stock: 60
}, {
  _id: '4',
  name: '烤茄子',
  price: 8,
  description: '蒜蓉烤制，香辣可口',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  hot: true,
  stock: 40
}, {
  _id: '5',
  name: '烤韭菜',
  price: 6,
  description: '新鲜韭菜，蒜香浓郁',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
  hot: false,
  stock: 50
}, {
  _id: '6',
  name: '烤玉米',
  price: 5,
  description: '甜玉米，刷酱烤制',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
  hot: false,
  stock: 45
}, {
  _id: '7',
  name: '烤馒头片',
  price: 3,
  description: '外酥里软，刷甜面酱',
  category: '主食',
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  hot: false,
  stock: 70
}, {
  _id: '8',
  name: '烤红薯',
  price: 8,
  description: '蜜薯烤制，香甜软糯',
  category: '主食',
  image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  hot: true,
  stock: 30
}, {
  _id: '9',
  name: '烤金针菇',
  price: 6,
  description: '蒜蓉烤制，口感爽脆',
  category: '蔬菜',
  image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
  hot: false,
  stock: 55
}, {
  _id: '10',
  name: '烤生蚝',
  price: 12,
  description: '蒜蓉粉丝，鲜美无比',
  category: '海鲜',
  image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
  hot: true,
  stock: 25
}];

// 初始订单数据
const statusConfig = {
  pending: {
    label: '待处理',
    color: 'bg-yellow-500',
    icon: Loader2
  },
  preparing: {
    label: '制作中',
    color: 'bg-blue-500',
    icon: Loader2
  },
  completed: {
    label: '已完成',
    color: 'bg-green-500',
    icon: ShoppingBag
  },
  cancelled: {
    label: '已取消',
    color: 'bg-red-500',
    icon: Settings
  }
};
const initialTables = [{
  id: 'A01',
  name: 'A01'
}, {
  id: 'A02',
  name: 'A02'
}, {
  id: 'A03',
  name: 'A03'
}, {
  id: 'B01',
  name: 'B01'
}, {
  id: 'B02',
  name: 'B02'
}, {
  id: 'B03',
  name: 'B03'
}, {
  id: 'C01',
  name: 'C01'
}, {
  id: 'C02',
  name: 'C02'
}];
export default function DashboardPage({
  className,
  style,
  $w
}) {
  const {
    toast
  } = useToast();

  // 导航状态
  const [activeTab, setActiveTab] = useState('products');

  // 商品管理状态
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [useLocalData, setUseLocalData] = useState(false);
  const [categories, setCategories] = useState(['肉类', '蔬菜', '海鲜', '主食']);
  const [tables, setTables] = useState(initialTables);

  // 订单管理状态
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 登录验证
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 加载商品数据
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  // 加载订单数据
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // 登录验证
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (isLoggedIn !== 'true') {
      // 未登录，跳转到登录页
      $w.utils.navigateTo({
        pageId: 'login',
        params: {}
      });
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // 未登录时显示加载状态
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">正在跳转到登录页...</p>
        </div>
      </div>;
  }

  // 加载商品数据
  const loadProducts = async () => {
    setLoading(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_product').get();
      if (result.data.length > 0) {
        setProducts(result.data);
        setUseLocalData(false);
      } else {
        setProducts(initialProducts);
        setUseLocalData(true);
      }
    } catch (error) {
      console.error('加载商品数据失败:', error);
      setProducts(initialProducts);
      setUseLocalData(true);
    } finally {
      setLoading(false);
    }
  };

  // 加载订单数据
  const loadOrders = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_order').get();
      console.log('加载订单数据结果:', result);
      if (result.data.length > 0) {
        setOrders(result.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('加载订单数据失败:', error);
      setOrders([]);
    }
  };

  // 添加商品
  const handleAddProduct = async product => {
    setSubmitting(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const newProduct = {
        ...product,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      console.log('开始添加商品:', newProduct);
      await db.collection('restaurant_product').add(newProduct);
      console.log('商品添加成功');
      await loadProducts();
      setIsAddDialogOpen(false);
      toast({
        title: '成功',
        description: '商品添加成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('添加商品失败:', error);
      toast({
        title: '错误',
        description: '添加商品失败: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 编辑商品
  const handleEditProduct = async product => {
    setSubmitting(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      console.log('开始更新商品，商品ID:', product._id);

      // 使用 where 条件更新商品
      const result = await db.collection('restaurant_product').where({
        _id: product._id
      }).update(product);
      console.log('商品更新结果:', result);
      await loadProducts();
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: '成功',
        description: '商品更新成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('更新商品失败:', error);
      toast({
        title: '错误',
        description: '更新商品失败: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 删除商品
  const handleDeleteProduct = async productId => {
    if (!confirm('确定要删除这个商品吗？')) {
      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      console.log('开始删除商品，商品ID:', productId);

      // 使用 where 条件删除商品
      const result = await db.collection('restaurant_product').where({
        _id: productId
      }).remove();
      console.log('商品删除结果:', result);
      await loadProducts();
      toast({
        title: '成功',
        description: '商品删除成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('删除商品失败:', error);
      toast({
        title: '错误',
        description: '删除商品失败: ' + error.message,
        variant: 'destructive'
      });
    }
  };

  // 更新订单状态
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_order').where({
        _id: orderId
      }).update({
        status: newStatus
      });
      console.log('订单状态更新结果:', result);
      await loadOrders();
      toast({
        title: '成功',
        description: '订单状态更新成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('更新订单状态失败:', error);
      toast({
        title: '错误',
        description: '更新订单状态失败: ' + error.message,
        variant: 'destructive'
      });
    }
  };

  // 删除订单
  const handleDeleteOrder = async orderId => {
    console.log('准备删除订单，订单ID:', orderId);
    if (!confirm('确定要删除这个订单吗？此操作不可恢复。')) {
      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      console.log('开始删除订单，订单ID:', orderId);

      // 使用 where 条件删除订单
      const result = await db.collection('restaurant_order').where({
        _id: orderId
      }).remove();
      console.log('订单删除结果:', result);
      console.log('删除的订单ID:', orderId);

      // 重新加载订单数据
      await loadOrders();
      toast({
        title: '成功',
        description: '订单删除成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('删除订单失败:', error);
      console.error('错误详情:', error.message);
      toast({
        title: '错误',
        description: '删除订单失败: ' + error.message,
        variant: 'destructive'
      });
    }
  };

  // 过滤商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    const orderNo = (order.orderNo || '').toLowerCase();
    const tableNumber = (order.tableNumber || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = orderNo.includes(searchLower) || tableNumber.includes(searchLower);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // 计算统计数据
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length : 0
  };

  // 导航菜单项
  const navItems = [{
    id: 'products',
    label: '商品管理',
    icon: Package
  }, {
    id: 'orders',
    label: '订单管理',
    icon: ShoppingBag
  }, {
    id: 'statistics',
    label: '数据统计',
    icon: BarChart3
  }];
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">烧烤店管理系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">管理员</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
              localStorage.removeItem('admin_logged_in');
              $w.utils.navigateTo({
                pageId: 'login',
                params: {}
              });
            }}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 导航标签 */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex space-x-2">
            {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>;
          })}
          </div>
        </div>

        {/* 商品管理面板 */}
        {activeTab === 'products' && <div className="space-y-6">
            {/* 操作栏 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="搜索商品名称或描述..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="全部">全部分类</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Plus className="w-4 h-4 mr-2" />
                    添加商品
                  </Button>
                </div>
              </div>
            </div>

            {/* 分类和桌号管理 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryManager categories={categories} setCategories={setCategories} />
              <TableManager tables={tables} setTables={setTables} />
            </div>

            {/* 商品列表 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">商品列表</h2>
                <Button variant="outline" size="sm" onClick={loadProducts}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新
                </Button>
              </div>
              {loading ? <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div> : filteredProducts.length === 0 ? <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>暂无商品数据</p>
                </div> : <ProductTable products={filteredProducts} onEdit={product => {
            setEditingProduct(product);
            setIsEditDialogOpen(true);
          }} onDelete={handleDeleteProduct} />}
            </div>

            {/* 添加商品对话框 */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>添加商品</DialogTitle>
                </DialogHeader>
                <ProductForm categories={categories} onSubmit={handleAddProduct} onCancel={() => setIsAddDialogOpen(false)} submitting={submitting} />
              </DialogContent>
            </Dialog>

            {/* 编辑商品对话框 */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>编辑商品</DialogTitle>
                </DialogHeader>
                <ProductForm product={editingProduct} categories={categories} onSubmit={handleEditProduct} onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingProduct(null);
            }} submitting={submitting} />
              </DialogContent>
            </Dialog>
          </div>}

        {/* 订单管理面板 */}
        {activeTab === 'orders' && <div className="space-y-6">
            {/* 操作栏 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="搜索订单号或桌号..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="all">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="preparing">制作中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={loadOrders}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    刷新
                  </Button>
                </div>
              </div>
            </div>

            {/* 订单列表 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">订单列表</h2>
              {filteredOrders.length === 0 ? <div className="text-center py-12 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>暂无订单数据</p>
                </div> : <div className="space-y-4">
                  {filteredOrders.map(order => {
              const StatusIcon = statusConfig[order.status]?.icon || Settings;
              return <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-gray-800">{order.orderNo}</h3>
                              <Badge className={`${statusConfig[order.status]?.color} text-white`}>
                                {statusConfig[order.status]?.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>桌号: {order.tableNumber}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {order.items.slice(0, 3).map((item, index) => <div key={index} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                                  <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                                  <span className="text-sm">{item.name} x{item.quantity}</span>
                                </div>)}
                              {order.items.length > 3 && <span className="text-sm text-gray-500">+{order.items.length - 3} 更多</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-orange-600">¥{order.total}</span>
                            <Button variant="outline" size="sm" onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetail(true);
                    }}>
                              <Eye className="w-4 h-4 mr-1" />
                              详情
                            </Button>
                            <select value={order.status} onChange={e => handleUpdateOrderStatus(order._id, e.target.value)} className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                              <option value="pending">待处理</option>
                              <option value="preparing">制作中</option>
                              <option value="completed">已完成</option>
                              <option value="cancelled">已取消</option>
                            </select>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(order._id)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>;
            })}
                </div>}
            </div>

            {/* 订单详情弹窗 */}
            <OrderDetailDialog order={selectedOrder} open={showOrderDetail} onOpenChange={setShowOrderDetail} />
          </div>}

        {/* 数据统计面板 */}
        {activeTab === 'statistics' && <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">总订单数</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">总营收</p>
                    <p className="text-3xl font-bold text-gray-800">¥{stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">待处理订单</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">平均订单金额</p>
                    <p className="text-3xl font-bold text-gray-800">¥{stats.avgOrderValue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* 订单状态分布 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">订单状态分布</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusConfig).map(([status, config]) => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : 0;
              const Icon = config.icon;
              return <div key={status} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${config.color.replace('bg-', 'text-')}`} />
                        <span className="text-2xl font-bold text-gray-800">{count}</span>
                      </div>
                      <p className="text-sm text-gray-600">{config.label}</p>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${config.color} transition-all duration-500`} style={{
                    width: `${percentage}%`
                  }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                    </div>;
            })}
              </div>
            </div>

            {/* 热门商品排行 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">热门商品排行</h2>
              <div className="space-y-4">
                {(() => {
              const productSales = {};
              orders.forEach(order => {
                order.items.forEach(item => {
                  if (!productSales[item.name]) {
                    productSales[item.name] = {
                      name: item.name,
                      image: item.image,
                      quantity: 0,
                      revenue: 0
                    };
                  }
                  productSales[item.name].quantity += item.quantity;
                  productSales[item.name].revenue += item.price * item.quantity;
                });
              });
              const sortedProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
              return sortedProducts.map((product, index) => <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">销量: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">¥{product.revenue.toFixed(2)}</p>
                      </div>
                    </div>);
            })()}
              </div>
            </div>
          </div>}
      </div>
    </div>;
}
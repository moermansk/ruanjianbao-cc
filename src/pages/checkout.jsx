// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Package, DollarSign, TrendingUp, Loader2, RefreshCw, Clock, CheckCircle, XCircle, UtensilsCrossed, MapPin, Eye } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, useToast, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { OrderDetailDialog } from '@/components/OrderDetailDialog';

// 初始订单数据
const initialOrders = [{
  _id: '1',
  orderNo: 'ORD-20260226-1234',
  tableNumber: 'A01',
  items: [{
    id: '1',
    name: '羊肉串',
    price: 5,
    quantity: 5,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'
  }, {
    id: '2',
    name: '烤茄子',
    price: 8,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop'
  }],
  total: 41,
  status: 'pending',
  remark: '少辣',
  createdAt: '2026-02-26T10:30:00.000Z'
}, {
  _id: '2',
  orderNo: 'ORD-20260226-2345',
  tableNumber: 'B02',
  items: [{
    id: '3',
    name: '牛肉串',
    price: 6,
    quantity: 10,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
  }, {
    id: '4',
    name: '烤生蚝',
    price: 12,
    quantity: 6,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop'
  }],
  total: 132,
  status: 'preparing',
  remark: '',
  createdAt: '2026-02-26T11:15:00.000Z'
}, {
  _id: '3',
  orderNo: 'ORD-20260226-3456',
  tableNumber: 'C01',
  items: [{
    id: '5',
    name: '烤红薯',
    price: 8,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop'
  }],
  total: 24,
  status: 'completed',
  remark: '',
  createdAt: '2026-02-26T09:45:00.000Z'
}];
const statusConfig = {
  pending: {
    label: '待处理',
    color: 'bg-yellow-500',
    icon: Clock
  },
  preparing: {
    label: '制作中',
    color: 'bg-blue-500',
    icon: Loader2
  },
  completed: {
    label: '已完成',
    color: 'bg-green-500',
    icon: CheckCircle
  },
  cancelled: {
    label: '已取消',
    color: 'bg-red-500',
    icon: XCircle
  }
};
export default function CheckoutPage({
  className,
  style,
  $w
}) {
  const {
    toast
  } = useToast();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [useLocalData, setUseLocalData] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 自动跳转到新的 dashboard 页面
  useEffect(() => {
    if (isAuthenticated) {
      $w.utils.navigateTo({
        pageId: 'dashboard',
        params: {}
      });
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
  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'restaurant_order',
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
        setOrders(result.records);
      }
    } catch (error) {
      console.error('加载订单失败:', error);
      // 如果数据库不存在或查询失败，使用本地数据
      console.log('使用本地数据');
      setOrders(initialOrders);
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

  // 统计数据
  const stats = {
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    todayRevenue: orders.filter(o => {
      const orderDate = new Date(o.createdAt || Date.now());
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).reduce((sum, o) => sum + (o.total || 0), 0)
  };

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    const orderNo = (order.orderNo || '').toLowerCase();
    const tableNumber = (order.tableNumber || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = orderNo.includes(searchLower) || tableNumber.includes(searchLower);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // 更新订单状态
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      if (useLocalData) {
        // 本地数据模式
        setOrders(orders.map(o => (o._id || o.id) === orderId ? {
          ...o,
          status: newStatus
        } : o));
        toast({
          title: '状态已更新',
          description: `订单状态已更新为 ${statusConfig[newStatus].label}（本地数据模式）`,
          variant: 'default'
        });
      } else {
        // 数据库模式
        await $w.cloud.callDataSource({
          dataSourceName: 'restaurant_order',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: orderId,
              status: newStatus
            }
          }
        });
        toast({
          title: '状态已更新',
          description: `订单状态已更新为 ${statusConfig[newStatus].label}`,
          variant: 'default'
        });
        loadOrders();
      }
    } catch (error) {
      console.error('更新订单状态失败:', error);
      toast({
        title: '更新失败',
        description: error.message || '订单状态更新失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  // 查看订单详情
  const viewOrderDetail = order => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };
  return <div className={`min-h-screen bg-[#FAFAFA] ${className || ''}`} style={style}>
      {/* 顶部导航 */}
      <header className="bg-[#1A1A1A] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-[#FF5722]" />
              <div>
                <h1 className="text-2xl font-bold font-mono">前台结账</h1>
                <p className="text-xs text-gray-400">订单管理 · 状态跟踪</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={loadOrders} className="text-white border-white hover:bg-white hover:text-[#1A1A1A]">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
              <Button onClick={() => $w.utils.navigateTo({
              pageId: 'menu',
              params: {}
            })} className="bg-[#FF5722] hover:bg-[#E64A19] text-white">
                返回菜单
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-[#FF5722] animate-spin" />
          </div> : <>
            {/* 数据模式标识 */}
            {useLocalData && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                ⚠️ 当前使用本地数据模式
              </div>}

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">总订单</p>
                    <p className="text-2xl font-bold text-[#333333] font-mono">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-[#FF5722]" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">待处理</p>
                    <p className="text-2xl font-bold text-yellow-600 font-mono">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">制作中</p>
                    <p className="text-2xl font-bold text-blue-600 font-mono">{stats.preparing}</p>
                  </div>
                  <Loader2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">已完成</p>
                    <p className="text-2xl font-bold text-green-600 font-mono">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">已取消</p>
                    <p className="text-2xl font-bold text-red-600 font-mono">{stats.cancelled}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">今日营收</p>
                    <p className="text-2xl font-bold text-[#FF5722] font-mono">¥{stats.todayRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#FF5722]" />
                </div>
              </div>
            </div>

            {/* 操作栏 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  {/* 搜索框 */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="搜索订单号或桌号" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>

                  {/* 状态筛选 */}
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="preparing">制作中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 订单列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {filteredOrders.length === 0 ? <div className="p-12 text-center text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">暂无订单</p>
                  <p className="text-sm">还没有订单数据</p>
                </div> : <div className="divide-y divide-gray-100">
                  {filteredOrders.map(order => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;
              return <div key={order._id || order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-bold text-lg">{order.orderNo}</span>
                          <Badge className={`${statusInfo.color} text-white`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>桌号: {order.tableNumber}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{order.createdAt ? new Date(order.createdAt).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">商品:</span>
                          <div className="flex gap-1 flex-wrap">
                            {order.items && order.items.slice(0, 3).map((item, idx) => <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {item.name} x{item.quantity}
                              </span>)}
                            {order.items && order.items.length > 3 && <span className="text-sm text-gray-500">
                                +{order.items.length - 3} 更多
                              </span>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[#FF5722] font-mono">
                            ¥{order.total ? order.total.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => viewOrderDetail(order)} className="gap-2">
                          <Eye className="w-4 h-4" />
                          详情
                        </Button>
                        <Select value={order.status} onValueChange={value => updateOrderStatus(order._id || order.id, value)} disabled={updating}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">待处理</SelectItem>
                            <SelectItem value="preparing">制作中</SelectItem>
                            <SelectItem value="completed">已完成</SelectItem>
                            <SelectItem value="cancelled">已取消</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>;
            })}
                </div>}
            </div>
          </>}
      </main>

      {/* 订单详情弹窗 */}
      <OrderDetailDialog order={selectedOrder} open={showOrderDetail} onOpenChange={setShowOrderDetail} />
    </div>;
}
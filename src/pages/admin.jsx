// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Edit, Trash2, Search, Package, DollarSign, TrendingUp, Loader2, RefreshCw, Settings } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, useToast, Badge } from '@/components/ui';

import { ProductForm } from '@/components/ProductForm';
import { ProductTable } from '@/components/ProductTable';
import { CategoryManager } from '@/components/CategoryManager';
import { TableManager } from '@/components/TableManager';

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
}, {
  _id: '11',
  name: '烤鱿鱼',
  price: 15,
  description: '铁板鱿鱼，香辣过瘾',
  category: '海鲜',
  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  hot: false,
  stock: 20
}, {
  _id: '12',
  name: '烤大虾',
  price: 18,
  description: '新鲜大虾，蒜蓉烤制',
  category: '海鲜',
  image: 'https://images.unsplash.com/photo-1623689046286-01aae5144820?w=400&h=300&fit=crop',
  hot: true,
  stock: 15
}];

// 初始桌号列表
const initialTables = ['A01', 'A02', 'A03', 'B01', 'B02', 'B03', 'C01', 'C02'];
export default function AdminPage({
  className,
  style,
  $w
}) {
  const {
    toast
  } = useToast();
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 自动跳转到新的 dashboard 页面
  useEffect(() => {
    if (isAuthenticated) {
      $w.utils.navigateTo({
        pageId: 'dashboard',
        params: {}
      });
    }
  }, [isAuthenticated, $w]);

  // 加载商品数据
  useEffect(() => {
    if (isAuthenticated) {
      initDefaultCategories();
      loadProducts();
      loadCategories();
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
  // 初始化默认分类
  const initDefaultCategories = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_category').get();
      console.log('默认分类检查结果:', result);

      // 如果数据库中没有分类数据，则初始化默认分类
      if (!result.data || result.data.length === 0) {
        console.log('数据库中没有分类数据，开始初始化默认分类');
        const defaultCategories = ['肉类', '蔬菜', '海鲜', '主食'];
        for (const categoryName of defaultCategories) {
          const createResult = await db.collection('restaurant_category').add({
            name: categoryName
          });
          console.log(`分类 "${categoryName}" 创建结果:`, createResult);
        }
        console.log('默认分类已初始化');
      } else {
        console.log('数据库中已存在分类数据，跳过初始化');
      }
    } catch (error) {
      console.error('初始化默认分类失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
    }
  };

  // 加载分类数据
  const loadCategories = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_category').get();
      console.log('分类数据查询结果:', result);
      if (result.data && result.data.length > 0) {
        const categoryNames = result.data.map(record => record.name);
        setCategories(categoryNames);
        console.log('分类列表已更新:', categoryNames);
      } else {
        console.log('未找到分类数据，使用默认分类');
        setCategories(['肉类', '蔬菜', '海鲜', '主食']);
      }
    } catch (error) {
      console.error('加载分类数据失败:', error);
      // 如果数据库中没有分类数据，使用默认分类
      setCategories(['肉类', '蔬菜', '海鲜', '主食']);
    }
  };
  const loadProducts = async () => {
    try {
      setLoading(true);
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_product').get();
      console.log('商品数据查询结果:', result);
      console.log('商品数据详情:', JSON.stringify(result.data, null, 2));
      if (result.data && result.data.length > 0) {
        setProducts(result.data);
        console.log('商品列表已更新:', result.data);
      } else {
        console.log('未找到商品数据，使用本地数据');
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('加载商品失败:', error);
      // 如果数据库不存在或查询失败，使用本地数据
      console.log('使用本地数据');
      setProducts(initialProducts);
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
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    hotProducts: products.filter(p => p.hot).length,
    avgPrice: products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0
  };

  // 过滤商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 添加商品
  const handleAddProduct = async productData => {
    try {
      setSubmitting(true);
      if (useLocalData) {
        // 本地数据模式
        const newProduct = {
          ...productData,
          _id: String(Date.now())
        };
        setProducts([...products, newProduct]);
        setIsAddDialogOpen(false);
        toast({
          title: '添加成功',
          description: `商品 "${productData.name}" 已添加（本地数据模式）`,
          variant: 'default'
        });
      } else {
        // 数据库模式
        const tcb = await $w.cloud.getCloudInstance();
        const db = tcb.database();
        await db.collection('restaurant_product').add(productData);
        setIsAddDialogOpen(false);
        toast({
          title: '添加成功',
          description: `商品 "${productData.name}" 已添加`,
          variant: 'default'
        });
        loadProducts();
      }
    } catch (error) {
      console.error('添加商品失败:', error);
      toast({
        title: '添加失败',
        description: error.message || '商品添加失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 编辑商品
  const handleEditProduct = async productData => {
    try {
      setSubmitting(true);
      console.log('开始编辑商品:', productData);
      console.log('当前编辑的商品:', editingProduct);
      console.log('商品ID:', editingProduct._id);
      if (useLocalData) {
        // 本地数据模式
        setProducts(products.map(p => (p._id || p.id) === (editingProduct._id || editingProduct.id) ? {
          ...p,
          ...productData
        } : p));
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        toast({
          title: '更新成功',
          description: `商品 "${productData.name}" 已更新（本地数据模式）`,
          variant: 'default'
        });
      } else {
        // 数据库模式
        const tcb = await $w.cloud.getCloudInstance();
        const db = tcb.database();
        console.log('准备更新商品，ID:', editingProduct._id, '数据:', productData);
        const result = await db.collection('restaurant_product').doc(editingProduct._id).update({
          data: productData
        });
        console.log('商品更新结果:', result);
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        toast({
          title: '更新成功',
          description: `商品 "${productData.name}" 已更新`,
          variant: 'default'
        });
        loadProducts();
      }
    } catch (error) {
      console.error('更新商品失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      toast({
        title: '更新失败',
        description: error.message || '商品更新失败，请稍后重试',
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
      if (useLocalData) {
        // 本地数据模式
        setProducts(products.filter(p => (p._id || p.id) !== productId));
        toast({
          title: '删除成功',
          description: '商品已删除（本地数据模式）',
          variant: 'default'
        });
      } else {
        // 数据库模式
        const tcb = await $w.cloud.getCloudInstance();
        const db = tcb.database();
        await db.collection('restaurant_product').doc(productId).remove();
        toast({
          title: '删除成功',
          description: '商品已删除',
          variant: 'default'
        });
        loadProducts();
      }
    } catch (error) {
      console.error('删除商品失败:', error);
      toast({
        title: '删除失败',
        description: error.message || '商品删除失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 打开编辑对话框
  const openEditDialog = product => {
    console.log('打开编辑对话框，商品:', product);
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  // 分类管理
  const handleAddCategory = async category => {
    try {
      console.log('开始添加分类:', category);
      // 添加分类到数据库
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('restaurant_category').add({
        name: category
      });
      console.log('分类添加结果:', result);

      // 重新加载分类列表
      await loadCategories();
      toast({
        title: '分类已添加',
        description: `分类 "${category}" 已添加`
      });
    } catch (error) {
      console.error('添加分类失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      toast({
        title: '添加失败',
        description: error.message || '添加分类失败，请重试',
        variant: 'destructive'
      });
    }
  };
  const handleDeleteCategory = async category => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();

      // 从数据库中删除分类
      const result = await db.collection('restaurant_category').where({
        name: category
      }).remove();
      console.log('分类删除结果:', result);

      // 更新数据库中属于该分类的商品
      const productResult = await db.collection('restaurant_product').where({
        category: category
      }).update({
        category: '肉类'
      });
      console.log('商品分类更新结果:', productResult);

      // 重新加载分类和商品数据
      await loadCategories();
      await loadProducts();
      toast({
        title: '分类已删除',
        description: `分类 "${category}" 已删除，相关商品已移至默认分类`
      });
    } catch (error) {
      console.error('删除分类失败:', error);
      toast({
        title: '删除失败',
        description: error.message || '删除分类失败，请重试',
        variant: 'destructive'
      });
    }
  };
  const handleRenameCategory = async (oldName, newName) => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();

      // 更新数据库中的分类名称
      const result = await db.collection('restaurant_category').where({
        name: oldName
      }).update({
        data: {
          name: newName
        }
      });
      console.log('分类重命名结果:', result);

      // 更新数据库中属于该分类的商品
      const productResult = await db.collection('restaurant_product').where({
        category: oldName
      }).update({
        data: {
          category: newName
        }
      });
      console.log('商品分类更新结果:', productResult);

      // 重新加载分类和商品数据
      await loadCategories();
      await loadProducts();
      toast({
        title: '分类已重命名',
        description: `分类 "${oldName}" 已重命名为 "${newName}"，相关商品已更新`
      });
    } catch (error) {
      console.error('重命名分类失败:', error);
      toast({
        title: '重命名失败',
        description: error.message || '重命名分类失败，请重试',
        variant: 'destructive'
      });
    }
  };

  // 桌号管理
  const handleAddTable = table => {
    setTables([...tables, table]);
  };
  const handleDeleteTable = table => {
    setTables(tables.filter(t => t !== table));
  };
  const handleRenameTable = (oldName, newName) => {
    setTables(tables.map(t => t === oldName ? newName : t));
  };
  return <div className={`min-h-screen bg-[#FAFAFA] ${className || ''}`} style={style}>
      {/* 顶部导航 */}
      <header className="bg-[#1A1A1A] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#FF5722]" />
              <div>
                <h1 className="text-2xl font-bold font-mono">管理后台</h1>
                <p className="text-xs text-gray-400">商品管理 · 分类管理 · 桌号管理</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={loadProducts} className="text-white border-white hover:bg-white hover:text-[#1A1A1A]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">商品总数</p>
                    <p className="text-3xl font-bold text-[#333333] font-mono">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-12 h-12 text-[#FF5722]" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">库存总值</p>
                    <p className="text-3xl font-bold text-[#333333] font-mono">¥{stats.totalValue}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-[#FF5722]" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">热销商品</p>
                    <p className="text-3xl font-bold text-[#333333] font-mono">{stats.hotProducts}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-[#FF5722]" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">平均价格</p>
                    <p className="text-3xl font-bold text-[#333333] font-mono">¥{stats.avgPrice}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-[#FF5722]" />
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
                    <Input placeholder="搜索商品名称或描述" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>

                  {/* 分类筛选 */}
                  <div className="flex gap-2 flex-wrap">
                    {['全部', ...categories].map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {category}
                      </button>)}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <CategoryManager categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} onRenameCategory={handleRenameCategory} />
                  <TableManager tables={tables} onAddTable={handleAddTable} onDeleteTable={handleDeleteTable} onRenameTable={handleRenameTable} />
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        添加商品
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>添加商品</DialogTitle>
                      </DialogHeader>
                      <ProductForm categories={categories} onSubmit={handleAddProduct} onCancel={() => setIsAddDialogOpen(false)} submitting={submitting} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* 商品列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ProductTable products={filteredProducts} onEdit={openEditDialog} onDelete={handleDeleteProduct} />
            </div>
          </>}
      </main>

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
    </div>;
}
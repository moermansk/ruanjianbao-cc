// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, X, Edit2, Check } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, useToast, DialogTrigger } from '@/components/ui';

export function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory
}) {
  const {
    toast
  } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState('');
  const handleAddNewCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: '请输入分类名称',
        variant: 'destructive'
      });
      return;
    }
    if (categories.includes(newCategory.trim())) {
      toast({
        title: '分类已存在',
        variant: 'destructive'
      });
      return;
    }
    onAddCategory(newCategory.trim());
    setNewCategory('');
  };
  const handleDeleteCategoryItem = category => {
    if (category === '肉类' || category === '蔬菜' || category === '海鲜' || category === '主食') {
      toast({
        title: '无法删除',
        description: '默认分类不能删除',
        variant: 'destructive'
      });
      return;
    }
    onDeleteCategory(category);
  };
  const handleStartEdit = category => {
    setEditingCategory(category);
    setEditingName(category);
  };
  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      toast({
        title: '请输入分类名称',
        variant: 'destructive'
      });
      return;
    }
    if (editingName.trim() !== editingCategory && categories.includes(editingName.trim())) {
      toast({
        title: '分类已存在',
        variant: 'destructive'
      });
      return;
    }
    onRenameCategory(editingCategory, editingName.trim());
    setEditingCategory(null);
    setEditingName('');
  };
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingName('');
  };
  return <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            管理分类
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>管理商品分类</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 添加新分类 */}
            <div className="flex gap-2">
              <Input placeholder="输入新分类名称" value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddNewCategory()} />
              <Button onClick={handleAddNewCategory}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* 分类列表 */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map(category => <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingCategory === category ? <div className="flex items-center gap-2 flex-1">
                      <Input value={editingName} onChange={e => setEditingName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSaveEdit()} className="flex-1" />
                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div> : <>
                      <span className="font-medium">{category}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleStartEdit(category)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCategoryItem(category)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>}
                </div>)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
}
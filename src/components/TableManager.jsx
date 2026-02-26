// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Plus, X, Edit2, Check } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, useToast, DialogTrigger } from '@/components/ui';

export function TableManager({
  tables = [],
  onAddTable = () => console.warn('⚠️ onAddTable 未定义'),
  onDeleteTable = () => console.warn('⚠️ onDeleteTable 未定义'),
  onRenameTable = () => console.warn('⚠️ onRenameTable 未定义')
}) {
  const {
    toast
  } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newTable, setNewTable] = useState('');
  const [editingTable, setEditingTable] = useState(null);
  const [editingName, setEditingName] = useState('');
  const handleAddNewTable = () => {
    if (!newTable.trim()) {
      toast({
        title: '请输入桌号',
        variant: 'destructive'
      });
      return;
    }
    if (tables.includes(newTable.trim())) {
      toast({
        title: '桌号已存在',
        variant: 'destructive'
      });
      return;
    }
    onAddTable(newTable.trim());
    setNewTable('');
    toast({
      title: '桌号已添加',
      description: `桌号 "${newTable}" 已添加`
    });
  };
  const handleDeleteTableItem = table => {
    onDeleteTable(table);
    toast({
      title: '桌号已删除',
      description: `桌号 "${table}" 已删除`
    });
  };
  const handleStartEdit = table => {
    setEditingTable(table);
    setEditingName(table);
  };
  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      toast({
        title: '请输入桌号',
        variant: 'destructive'
      });
      return;
    }
    if (editingName.trim() !== editingTable && tables.includes(editingName.trim())) {
      toast({
        title: '桌号已存在',
        variant: 'destructive'
      });
      return;
    }
    onRenameTable(editingTable, editingName.trim());
    setEditingTable(null);
    setEditingName('');
    toast({
      title: '桌号已重命名',
      description: `桌号 "${editingTable}" 已重命名为 "${editingName}"`
    });
  };
  const handleCancelEdit = () => {
    setEditingTable(null);
    setEditingName('');
  };
  return <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            管理桌号
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>管理桌号</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 添加新桌号 */}
            <div className="flex gap-2">
              <Input placeholder="输入桌号（如：A01、B02）" value={newTable} onChange={e => setNewTable(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddNewTable()} />
              <Button onClick={handleAddNewTable}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* 桌号列表 */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tables.map(table => <div key={table} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingTable === table ? <div className="flex items-center gap-2 flex-1">
                      <Input value={editingName} onChange={e => setEditingName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSaveEdit()} className="flex-1" />
                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div> : <>
                      <span className="font-medium">{table}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleStartEdit(table)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTableItem(table)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Input, useToast, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { Loader2 } from 'lucide-react';

// @ts-ignore;
import { useForm } from 'react-hook-form';
// @ts-ignore;
import { ImageUpload } from '@/components/ImageUpload';
export function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  submitting
}) {
  const {
    toast
  } = useToast();
  const form = useForm({
    defaultValues: product || {
      name: '',
      price: '',
      description: '',
      category: categories && categories.length > 0 ? categories[0] : '肉类',
      image: '',
      hot: false,
      stock: ''
    }
  });

  // 当 product 或 categories 变化时更新表单值
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        price: product.price ? String(product.price) : '',
        description: product.description || '',
        category: product.category || (categories && categories.length > 0 ? categories[0] : '肉类'),
        image: product.image || '',
        hot: product.hot || false,
        stock: product.stock ? String(product.stock) : ''
      });
    }
  }, [product, categories, form]);
  const handleSubmit = async data => {
    try {
      const productData = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        category: data.category,
        image: data.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        hot: data.hot,
        stock: parseInt(data.stock)
      };
      onSubmit(productData);
    } catch (error) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  return <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 商品名称 */}
          <FormField control={form.control} name="name" rules={{
          required: '请输入商品名称'
        }} render={({
          field
        }) => <FormItem>
                <FormLabel>商品名称 *</FormLabel>
                <FormControl>
                  <Input placeholder="例如：羊肉串" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          {/* 价格 */}
          <FormField control={form.control} name="price" rules={{
          required: '请输入价格',
          pattern: {
            value: /^\d*\.?\d+$/,
            message: '请输入有效的价格'
          }
        }} render={({
          field
        }) => <FormItem>
                <FormLabel>价格 (元) *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="例如：5.00" {...field} onChange={e => field.onChange(e.target.value)} />
                </FormControl>
                <FormDescription>支持小数点后两位，可随时修改</FormDescription>
                <FormMessage />
              </FormItem>} />

          {/* 分类 */}
          <FormField control={form.control} name="category" rules={{
          required: '请选择分类'
        }} render={({
          field
        }) => <FormItem>
                <FormLabel>分类 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories && categories.length > 0 ? categories.map(cat => <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>) : <SelectItem value="肉类">肉类</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>} />

          {/* 库存 */}
          <FormField control={form.control} name="stock" rules={{
          required: '请输入库存数量',
          pattern: {
            value: /^\d+$/,
            message: '请输入有效的库存数量'
          }
        }} render={({
          field
        }) => <FormItem>
                <FormLabel>库存数量 *</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="例如：100" {...field} onChange={e => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>

        {/* 商品描述 */}
        <FormField control={form.control} name="description" rules={{
        required: '请输入商品描述'
      }} render={({
        field
      }) => <FormItem>
              <FormLabel>商品描述 *</FormLabel>
              <FormControl>
                <Input placeholder="例如：新鲜羊肉，秘制腌制" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        {/* 商品图片 */}
        <FormField control={form.control} name="image" render={({
        field
      }) => <FormItem>
              <FormLabel>商品图片</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} disabled={submitting} />
              </FormControl>
              <FormDescription>支持上传本地图片，或使用默认图片</FormDescription>
              <FormMessage />
            </FormItem>} />

        {/* 热销标签 */}
        <FormField control={form.control} name="hot" render={({
        field
      }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">热销商品</FormLabel>
                <FormDescription>标记为热销商品，将在首页突出显示</FormDescription>
              </div>
              <FormControl>
                <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} className="w-5 h-5 text-[#FF5722] rounded focus:ring-[#FF5722]" />
              </FormControl>
            </FormItem>} />

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">
            取消
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1 bg-[#FF5722] hover:bg-[#E64A19] text-white">
            {submitting ? <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                提交中...
              </> : product ? '更新商品' : '添加商品'}
          </Button>
        </div>
      </form>
    </Form>;
}
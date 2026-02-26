// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export function ImageUpload({
  value,
  onChange,
  disabled
}) {
  const [uploading, setUploading] = useState(false);
  const handleFileSelect = async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }
    setUploading(true);
    try {
      // 生成唯一文件名
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      const fileName = `products/${timestamp}-${random}-${file.name}`;

      // 这里需要使用云存储上传
      // 由于当前环境限制，我们使用 FileReader 转换为 base64
      const reader = new FileReader();
      reader.onload = e => {
        const base64 = e.target?.result;
        onChange(base64);
        setUploading(false);
      };
      reader.onerror = () => {
        alert('图片读取失败');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('上传失败:', error);
      alert('图片上传失败');
      setUploading(false);
    }
  };
  const handleRemove = () => {
    onChange('');
  };
  return <div className="space-y-3">
      {/* 图片预览区域 */}
      {value ? <div className="relative group">
          <img src={value} alt="商品图片" className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-gray-300" />
          {!disabled && <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>}
        </div> : <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">暂无图片</p>
        </div>}

      {/* 上传按钮 */}
      {!disabled && <div className="flex items-center gap-2">
          <input type="file" id="image-upload" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={uploading} />
          <label htmlFor="image-upload" className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#FF5722] text-white hover:bg-[#E64A19] cursor-pointer'}`}>
            {uploading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                上传中...
              </> : <>
                <Upload className="h-4 w-4 mr-2" />
                {value ? '更换图片' : '上传图片'}
              </>}
          </label>
          <span className="text-xs text-gray-500">支持 JPG、PNG、GIF，最大 5MB</span>
        </div>}
    </div>;
}
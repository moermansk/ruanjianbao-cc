// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Edit, Trash2, Flame } from 'lucide-react';
// @ts-ignore;
import { Button, Badge } from '@/components/ui';

export function ProductTable({
  products,
  onEdit,
  onDelete
}) {
  if (products.length === 0) {
    return <div className="p-12 text-center text-gray-500">
        <p className="text-lg">暂无商品数据</p>
        <p className="text-sm mt-2">点击上方"添加商品"按钮开始添加</p>
      </div>;
  }
  return <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              商品信息
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              分类
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              价格
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              库存
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              状态
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map(product => <tr key={product._id} className="hover:bg-gray-50 transition-colors">
              {/* 商品信息 */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1A1A1A]">{product.name}</p>
                      {product.hot && <Badge className="bg-[#FF5722] hover:bg-[#E64A19]">
                          <Flame className="w-3 h-3 mr-1" />
                          热销
                        </Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  </div>
                </div>
              </td>

              {/* 分类 */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {product.category}
                </span>
              </td>

              {/* 价格 */}
              <td className="px-6 py-4">
                <span className="text-lg font-semibold text-[#FF5722]" style={{
              fontFamily: 'Space Mono, monospace'
            }}>
                  ¥{product.price.toFixed(2)}
                </span>
              </td>

              {/* 库存 */}
              <td className="px-6 py-4">
                <span className={`font-medium ${product.stock > 50 ? 'text-green-600' : product.stock > 20 ? 'text-yellow-600' : 'text-red-600'}`} style={{
              fontFamily: 'Space Mono, monospace'
            }}>
                  {product.stock}
                </span>
              </td>

              {/* 状态 */}
              <td className="px-6 py-4">
                {product.stock > 0 ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    在售
                  </Badge> : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    缺货
                  </Badge>}
              </td>

              {/* 操作 */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(product._id)} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                </div>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
}
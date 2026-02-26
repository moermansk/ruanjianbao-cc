// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Plus } from 'lucide-react';
// @ts-ignore;
import { Button, Badge } from '@/components/ui';

export function MenuItemCard({
  item,
  onAdd
}) {
  return <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
        {item.hot && <Badge className="absolute top-2 right-2 bg-[#FF5722]">
            🔥 热销
          </Badge>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-[#333333] text-lg">{item.name}</h3>
          <span className="text-[#FF5722] font-bold text-xl font-mono">
            ¥{item.price}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          <Button onClick={() => onAdd(item)} className="bg-[#FF5722] hover:bg-[#E64A19] text-white">
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
      </div>
    </div>;
}
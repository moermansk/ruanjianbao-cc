// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Minus, Plus, Coffee, UtensilsCrossed } from 'lucide-react';
// @ts-ignore;
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';

export function CartSheet({
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
                      <Button size="sm" variant="outline" onClick={() => onRemove(cartItem.id)} className="h-8 w-8 p-0">
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
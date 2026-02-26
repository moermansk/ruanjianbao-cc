// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Clock, MapPin, UtensilsCrossed, CheckCircle, XCircle, Loader2 } from 'lucide-react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, Badge } from '@/components/ui';

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
export function OrderDetailDialog({
  order,
  open,
  onOpenChange
}) {
  if (!order) return null;
  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>订单详情</span>
            <Badge className={`${statusInfo.color} text-white`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 订单基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Clock className="w-4 h-4" />
                <span>订单号</span>
              </div>
              <p className="font-mono font-bold text-lg">{order.orderNo}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>桌号</span>
              </div>
              <p className="font-mono font-bold text-lg">{order.tableNumber}</p>
            </div>
          </div>

          {/* 下单时间 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Clock className="w-4 h-4" />
              <span>下单时间</span>
            </div>
            <p className="font-mono">{order.createdAt ? new Date(order.createdAt).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN')}</p>
          </div>

          {/* 商品列表 */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#FF5722]" />
              商品清单
            </h3>
            <div className="space-y-3">
              {order.items && order.items.map((item, index) => <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#FF5722] font-mono">¥{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">¥{item.price}/份</p>
                  </div>
                </div>)}
            </div>
          </div>

          {/* 备注 */}
          {order.remark && <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">备注</h3>
              <p className="text-gray-600">{order.remark}</p>
            </div>}

          {/* 总价 */}
          <div className="border-t-2 border-[#FF5722] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">合计</span>
              <span className="text-3xl font-bold text-[#FF5722] font-mono">¥{order.total ? order.total.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}
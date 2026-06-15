import React, { useState } from 'react';
import { ArrowLeft, Terminal, Play, Zap, Bug, Code } from 'lucide-react';
import { ProductItem, OrderItem } from '../../../types';

interface PwaDeveloperProps {
  products: ProductItem[];
  orders: OrderItem[];
  onUpdateOrders: (updated: OrderItem[]) => void;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaDeveloper({
  products,
  orders,
  onUpdateOrders,
  addLog,
  showNotice,
  onBack
}: PwaDeveloperProps) {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'Secure TLS SSL Channel connected to gateway...',
    'Multi-Tenant sandbox isolation verification verified.',
    'Ready for webhook triggering payload.'
  ]);

  const handleTriggerWebhookOrder = () => {
    // Select random product or fallback
    const targetProduct = (products && products.length > 0) 
      ? products[Math.floor(Math.random() * products.length)] 
      : { id: 'prod_9r839', name: 'Luna Lounge Chair', price: 499, sku: 'SKU-LUNA-PRO' };

    const randomOrderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomUser = ['Albert Wagner (沙箱模拟)', 'Claire Laurent (沙箱模拟)', 'David Miller (沙箱模拟)'][Math.floor(Math.random() * 3)];
    const randomEmail = ['albert@test.de', 'claire@test.fr', 'david@test.com'][Math.floor(Math.random() * 3)];

    const freshMockOrder: OrderItem = {
      id: randomOrderId,
      customerName: randomUser,
      contact: randomEmail,
      total: targetProduct.price,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      riskScore: Math.floor(Math.random() * 20), // Low risk mock order
      shippingAddress: "42 Rue de l'Université, Paris, France",
      paymentMethod: 'Credit Card (Adyen Webhook Sandbox)',
      items: [
        {
          productId: targetProduct.id,
          sku: targetProduct.sku,
          name: targetProduct.name,
          price: targetProduct.price,
          quantity: 1
        }
      ]
    };

    onUpdateOrders([freshMockOrder, ...orders]);

    setConsoleLogs(current => [
      `[WEBHOOK] POST /api/payment/adyen-webhook HTTP/1.1 200 OK - Received Order ${randomOrderId}`,
      ...current
    ]);

    addLog(
      'Sandbox Webhook',
      '检测到外部交易注入',
      `模拟 Adyen 支付成功 Webhook 报文。订单号「${randomOrderId}」, 金额 $${targetProduct.price}`,
      'success'
    );

    showNotice(
      'Webhook 触发成功',
      `✓ 已经成功模拟外部客户结算！订单 ${randomOrderId} 已同步录入，可至 [订单中心] 履约。`,
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      {/* Sub Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shrink-0">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h2 className="text-sm font-bold text-slate-800">开发者控制沙盒</h2>
          <p className="text-[10px] text-slate-400">进行多租户 API 校调、Webhook 联调与测试注入</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-left">
        {/* API Info */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <Code className="w-4 h-4 text-[#07C2E3]" />
            <span>核心网关：API Sandbox</span>
          </div>
          <div className="space-y-1 font-mono text-[9px] text-slate-400 bg-slate-50 p-2.5 rounded border border-slate-100 font-semibold leading-relaxed">
            <p>API Endpoint: https://api.ecos-commerce.eu/v1</p>
            <p>Webhook Auth Signature: Header [X-ECOS-Signature]</p>
          </div>
        </div>

        {/* Transaction Simulator */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-3">
          <div className="text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#07C2E3]" />
              <span>模拟外部订单注入测试</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
              点击即可通过多租户支付网关（Adyen/Stripe）投送一段支付成功 Webhook 报文，借此模拟真实消费者购买并同步刷新。
            </p>
          </div>

          <button
            onClick={handleTriggerWebhookOrder}
            className="w-full bg-slate-800 hover:bg-slate-900 text-[#07C2E3] border border-[#07C2E3] py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>模拟测试 Webhook 订单支付</span>
          </button>
        </div>

        {/* Real-time console logs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 pl-1">
            <Terminal className="w-4 h-4" />
            <span>沙箱诊断 Trace 实时控制台</span>
          </h4>

          <div className="bg-slate-950 text-[#00ffcc] p-3 rounded-xl font-mono text-[9px] leading-relaxed border border-slate-800 space-y-1 min-h-[140px] text-left">
            {consoleLogs.map((log, idx) => (
              <p key={idx} className="break-all">
                &gt; {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

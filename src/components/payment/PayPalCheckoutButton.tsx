// ============================================================
// PayPal 결제 버튼 컴포넌트
// ============================================================
// PayPal SDK는 이 버튼이 화면에 나타날 때만 로드됩니다
// (앱 전체가 아니라 컴포넌트 안에서 PayPalScriptProvider로 감쌈).
//
// 사용법:
//   <PayPalCheckoutButton
//     product={product}
//     onSuccess={(details) => console.log('결제 완료', details)}
//     onError={(err) => console.error(err)}
//   />
//
// ⚠️ 실서비스에서는 브라우저 capture 대신 서버에서 주문 생성·승인을 처리해야 합니다.
// ============================================================

import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG, type PayPalProduct } from '../../lib/paypal';

const PAYPAL_SCRIPT_OPTIONS = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
};

interface PayPalCheckoutButtonProps {
  product: PayPalProduct;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({
  product,
  onSuccess,
  onError,
  onCancel,
}) => {
  return (
    <PayPalScriptProvider options={PAYPAL_SCRIPT_OPTIONS}>
      <div className="w-full max-w-md mx-auto">
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 50,
            tagline: false,
          }}
          createOrder={(_data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  description: product.description,
                  custom_id: product.id,
                  amount: {
                    currency_code: product.currency,
                    value: product.price,
                    breakdown: {
                      item_total: {
                        currency_code: product.currency,
                        value: product.price,
                      },
                    },
                  },
                  items: [
                    {
                      name: product.name,
                      unit_amount: {
                        currency_code: product.currency,
                        value: product.price,
                      },
                      quantity: '1',
                      category: 'DIGITAL_GOODS' as const,
                    },
                  ],
                },
              ],
              application_context: {
                brand_name: PAYPAL_CONFIG.brandName,
                shipping_preference: 'NO_SHIPPING' as const,
                user_action: 'PAY_NOW' as const,
              },
            });
          }}
          onApprove={async (_data, actions) => {
            if (actions.order) {
              const details = await actions.order.capture();
              onSuccess(details);
            }
          }}
          onError={(err) => {
            console.error('[PayPal] Error:', err);
            onError?.(err);
          }}
          onCancel={() => {
            onCancel?.();
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;

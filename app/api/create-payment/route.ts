import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': process.env.MONOBANK_API_TOKEN as string, // Use environment variable
        'Content-Type': 'application/json',
      } as HeadersInit,
      body: JSON.stringify({
        amount: parseInt(amount) * 100,
        ccy: 980,
        merchantPaymInfo: {
          reference: `payment-${Date.now()}`,
          destination: "Підтримка місії",
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`, // Use frontend URL from env
        webHookUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhook/mono`,
        saveCardData: {
          saveCard: true,
          walletId: `wallet-${Date.now()}`
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Monobank API error:', errorData);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
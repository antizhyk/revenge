import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Дані з вебхуку Monobank:', data);

    // Тут можна додати логіку обробки даних, наприклад, оновлення статусу платежу в базі даних

    return NextResponse.json({ received: true, data });
  } catch (error) {
    console.error('Помилка обробки вебхуку Monobank:', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
}

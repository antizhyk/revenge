import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Створюємо назву файлу з поточною датою
    const fileName = `payment-${Date.now()}.json`
    
    // Шлях до директорії з платежами
    const paymentsDir = path.join(process.cwd(), 'payments')
    
    // Створюємо директорію, якщо вона не існує
    try {
      await fs.access(paymentsDir)
    } catch {
      await fs.mkdir(paymentsDir, { recursive: true })
    }
    
    // Зберігаємо дані у файл
    await fs.writeFile(
      path.join(paymentsDir, fileName),
      JSON.stringify(data, null, 2)
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Помилка збереження платежу:', error)
    return NextResponse.json(
      { error: 'Помилка збереження платежу' },
      { status: 500 }
    )
  }
} 
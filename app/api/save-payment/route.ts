import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const payment = await prisma.payment.create({
      data: {
        invoiceId: body.invoiceId,
        amount: body.amount,
        status: body.status,
        pageUrl: body.pageUrl,
        timestamp: body.timestamp,
        walletId: body.saveCardData.walletId
      }
    })

    return NextResponse.json({ success: true, payment })
  } catch (error) {
    console.error('Error saving payment:', error)
    return NextResponse.json({ success: false, error: 'Failed to save payment' }, { status: 500 })
  }
}


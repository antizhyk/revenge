'use client'

import TestComponent from '@/components/TestComponent'

export default function TestPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Тестова сторінка</h1>
      
      <div className="space-y-4">
        <TestComponent />
      </div>
    </main>
  )
}
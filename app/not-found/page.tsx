import Button from '@/components/button'
import React from 'react'

export default function page() {
  return (
    <main className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
        <Button className='bg-[#2a9] px-6 py-3' buttonProps={{onClick: () => window.location.href = "/"}}>
            Go Back Home
        </Button>
    </main>
  )
}

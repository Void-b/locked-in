'use client'

import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Locked-In Challenge</h1>
        <button onClick={logout} className="bg-red-600 py-1 px-3 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  )
}

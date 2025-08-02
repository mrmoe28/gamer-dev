'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function UserMenu() {
  const { data: session } = useSession()
  
  if (!session?.user) return null
  
  return (
    <div className="flex items-center gap-4">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <span>{session.user.name}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Sign out
      </button>
    </div>
  )
}
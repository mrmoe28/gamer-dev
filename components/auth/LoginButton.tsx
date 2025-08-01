'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export function LoginButton() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <p>Loading...</p>
  }
  
  if (session) {
    return (
      <>
        Signed in as {session.user?.email}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  
  return <button onClick={() => signIn('google')}>Sign in with Google</button>
}
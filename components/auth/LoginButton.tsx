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
        <button type="button" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  
  return <button type="button" onClick={() => signIn('google')}>Sign in with Google</button>
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'

export function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter()
    const pathname = usePathname()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      const isLogin = Cookies.get('is_login')

      // Block access to auth pages if already logged in
      const isAuthRoute = pathname === '/auth/login' || pathname === '/auth/register'

      if (isLogin && isAuthRoute) {
        router.back()
        return
      }

      // Block unauthenticated users from protected pages
      if (!isLogin && !isAuthRoute) {
        router.replace('/auth/login')
        return
      }

      setIsClient(true)
    }, [pathname, router])

    if (!isClient) return null
    return <Component {...props} />
  }
}

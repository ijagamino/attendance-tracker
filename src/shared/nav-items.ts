import type { Role } from "@/supabase/global.types"

type NavItem = {
  title: string
  url: string
  isAuth: boolean
  role?: Role
}

export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    isAuth: true,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    isAuth: true,
    role: 'admin',
  },
  {
    title: 'Records',
    url: '/records',
    isAuth: true,
  },
  {
    title: 'Users',
    url: '/users',
    isAuth: true,
    role: 'admin',
  },
  {
    title: 'Leave requests',
    url: '/leave-requests',
    isAuth: true,
  },
  {
    title: 'Activity logs',
    url: '/activity-logs',
    isAuth: true,
  }
]

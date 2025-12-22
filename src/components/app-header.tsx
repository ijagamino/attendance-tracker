import { NavLink, useNavigate } from 'react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { ModeToggle } from '@/components/mode-toggle'
import { useAuth } from '@/app/providers/auth-provider'
import { Button } from '@/components/ui/button.tsx'
import type { Role } from '@/supabase/global.types'
import { LogIn, LogOut } from 'lucide-react'

type NavItem = {
  title: string
  href: string
  isAuth: boolean
  role?: Role
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    isAuth: true,
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    isAuth: true,
    role: 'admin',
  },
  {
    title: 'Records',
    href: '/records',
    isAuth: true,
  },
]

export default function AppHeader() {
  const { isAuth, role, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <h6>Attendance Tracker System</h6>

      <div className="flex space-x-2">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems
              .filter((navItem) => {
                if (navItem.role) return navItem.role === role

                return navItem.isAuth === isAuth
              })
              .map((navItem) => (
                <NavigationMenuItem key={navItem.href}>
                  <NavigationMenuLink asChild>
                    <NavLink to={navItem.href}>{navItem.title}</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>

        {isAuth ? (
          <Button
            onClick={() => {
              logout()
            }}
          >
            <LogOut />
            Log out
          </Button>
        ) : (
          <Button
            onClick={() => {
              navigate('/login')
            }}
          >
            <LogIn />
            Log in
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}

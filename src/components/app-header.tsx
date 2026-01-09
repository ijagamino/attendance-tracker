import { useAuth } from '@/app/providers/auth-provider'
import { Button } from '@/components/ui/button.tsx'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import type { Role } from '@/supabase/global.types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { useTheme } from '@/app/providers/theme-provider'
import { cn } from '@/lib/utils'
import { TypographyH4 } from './ui/typography'

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
  {
    title: 'Users',
    href: '/users',
    isAuth: true,
    role: 'admin',
  },
]

export default function AppHeader() {
  const { isAuth, role, logout } = useAuth()
  const { setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <TypographyH4>Attendance Tracker System</TypographyH4>

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
                  <NavLink
                    className={({ isActive }) =>

                      cn(
                        navigationMenuTriggerStyle(),
                        'border-b-2 border-background',
                        isActive && 'border-b-primary')
                    }
                    to={navItem.href}
                  >
                    {navItem.title}
                  </NavLink>
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <NavLink to="/settings">
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem asChild> */}
            {/*   <NavLink to="/profile"> */}
            {/*     Profile */}
            {/*   </NavLink> */}
            {/* </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header >
  )
}

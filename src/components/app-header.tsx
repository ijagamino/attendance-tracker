import { useAuth } from '@/app/providers/auth-provider'
import { useTheme } from '@/app/providers/theme-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { SidebarTrigger } from './ui/sidebar'
import { TypographyH4 } from './ui/typography'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function AppHeader() {
  const { fullName, avatar, logout } = useAuth()
  const { setTheme } = useTheme()

  return (
    <header className="grid grid-cols-3 items-center justify-between px-4 py-2 border-b">
      <SidebarTrigger />

      <TypographyH4 className="text-center">Attendance Tracking System</TypographyH4>

      <div className="flex gap-4 items-center justify-end">
        Welcome, {fullName}!
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={avatar} />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>

            </Avatar>
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

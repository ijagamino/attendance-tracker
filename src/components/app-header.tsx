import { useAuth } from '@/app/providers/auth-provider';
import { useTheme } from '@/app/providers/theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarTrigger } from './ui/sidebar';
import CompanyLogo from './company-logo';
import { Separator } from './ui/separator';

export default function AppHeader() {
  const { fullName, avatar, logout } = useAuth()
  const { setTheme } = useTheme()

  return (
    <header className="grid grid-cols-2 items-center justify-between px-4 py-2 border-b">
      <div className='flex gap-4 h-full items-center '>
        <SidebarTrigger />
        <Separator orientation='vertical' />
        <Link className="flex gap-2 items-center" to="/">
          <CompanyLogo className="size-8" />
          <div>
            <h1 className="font-extrabold tracking-tight text-balance">Techstacks</h1>
            <p className="text-xs leading-none font-medium text-muted-foreground">
              Employee Attendance and Leave Management System
            </p>
          </div>
        </Link>
      </div>

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

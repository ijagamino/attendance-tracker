import { useAuth } from '@/app/providers/auth-provider'
import { navItems } from '@/shared/nav-items'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Button } from './ui/button'
import { matchPath, NavLink, useLocation } from 'react-router'
import { LogOut } from 'lucide-react'

export default function AppSidebar() {
  const { isAuth, role, logout } = useAuth()

  const location = useLocation()

  function match(url: string) {
    if (url === '/') {
      return !!matchPath({ path: url }, location.pathname)
    }
    if (url !== '/') {
      return !!matchPath({ path: url, end: false }, location.pathname)
    }
    return undefined
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems
                .filter((navItem) => {
                  if (navItem.role) return navItem.role === role

                  return navItem.isAuth === isAuth
                })
                .map((navItem) => (
                  <SidebarMenuItem key={navItem.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={match(navItem.url)}
                    >
                      <NavLink
                        to={navItem.url}
                      >
                        {navItem.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant='secondary'
          onClick={() => logout()}
        >
          <LogOut />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

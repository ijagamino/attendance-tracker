import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "./auth-provider";

type NavItem = {
  title: string;
  href: string;
  isAuth?: boolean;
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Records",
    href: "/records",
  },
  {
    title: "Log In",
    href: "/login",
    isAuth: false,
  },
  {
    title: "Log Out",
    href: "/logout",
    isAuth: true,
  },
];

export default function AppHeader() {
  const { isAuth } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <h6>Attendance Tracker System</h6>

      <div className="flex space-x-2">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems
              .filter((navItem) => {
                if (navItem.isAuth === undefined) return true;

                return navItem.isAuth === isAuth;
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
        <ModeToggle />
      </div>
    </header>
  );
}

import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";

type NavItem = {
  title: string;
  href: string;
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
];

export default function AppHeader() {
  return (
    <header className="px-4 py-2 flex items-center justify-between">
      <h6>Attendance Tracker System</h6>

      <div className="flex space-x-2">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((navItem) => (
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

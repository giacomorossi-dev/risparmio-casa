// Wrapper applicativo: isola l'app dal primitivo shadcn (./ui/navigation-menu).
// Importa sempre da @rc/ui/components/navigation-menu, mai dal primitivo.

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu.tsx';

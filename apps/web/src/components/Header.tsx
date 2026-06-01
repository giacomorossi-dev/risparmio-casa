import { Avatar, AvatarFallback, AvatarImage } from '@rc/ui/components/avatar';
import { Button } from '@rc/ui/components/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@rc/ui/components/navigation-menu';
import { Separator } from '@rc/ui/components/separator';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { APPS } from '../apps.ts';
import { clerkEnabled } from '../lib/clerk.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

// `isSignedIn`/avatar arrivano dal loader di root (auth verificata lato server):
// l'header non carica clerk-js. clerk-js si carica solo entrando in /sign-in o /app.
type Props = {
  isSignedIn: boolean;
  imageUrl: string;
  initials: string;
};

export const Header = ({ isSignedIn, imageUrl, initials }: Props) => {
  const { t } = useTranslation();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold text-lg">
          {t('app.name')}
        </Link>

        <nav className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('nav.apps')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[22rem] gap-1 p-1">
                    {APPS.map((app) => {
                      const Icon = app.mascot;
                      return (
                        <li key={app.slug} className={`theme-${app.theme}`}>
                          <NavigationMenuLink
                            render={<Link to={`/${app.slug}`} />}
                            className="group/app hover:bg-gradient-to-br hover:from-primary hover:to-[color-mix(in_oklch,var(--primary),#000_35%)] hover:text-white"
                          >
                            <Icon
                              className="mt-0.5 shrink-0 text-primary group-hover/app:text-white"
                              aria-hidden="true"
                            />
                            <span className="flex flex-col gap-0.5">
                              <span className="font-medium text-foreground leading-none group-hover/app:text-white">
                                {t(`subapps.${app.slug}.title`)}
                              </span>
                              <span className="text-muted-foreground text-xs leading-snug group-hover/app:text-white/80">
                                {t(`subapps.${app.slug}.description`)}
                              </span>
                            </span>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/contatti" />} className="font-medium">
                  {t('nav.contact')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="mx-1 h-6">
            <Separator orientation="vertical" className="h-full" />
          </div>

          <ThemeToggle />

          {clerkEnabled &&
            (isSignedIn ? (
              <Link to="/app" aria-label={t('nav.dashboard')} className="rounded-full">
                <Avatar className="size-8">
                  <AvatarImage src={imageUrl} alt="" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button render={<Link to="/sign-in" />} nativeButton={false} size="sm">
                {t('nav.signIn')}
              </Button>
            ))}
        </nav>
      </div>
    </header>
  );
};

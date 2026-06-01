// Wrapper applicativo: isola l'app dal primitivo shadcn (./ui/avatar).
// Importa sempre da @rc/ui/components/avatar, mai dal primitivo.

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './ui/avatar.tsx';

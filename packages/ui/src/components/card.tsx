// Wrapper applicativo: isola l'app dal primitivo shadcn (./ui/card).
// Importa sempre da @rc/ui/components/card, mai da @rc/ui/components/ui/card.
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card.tsx';

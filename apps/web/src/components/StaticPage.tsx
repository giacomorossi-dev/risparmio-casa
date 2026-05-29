import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rc/ui/components/card';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export const StaticPage = ({ title, description, children }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    {children ? <CardContent>{children}</CardContent> : null}
  </Card>
);

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function DashboardCard({
  className,
  children,
  title
}: {
  className?: string,
  children: ReactNode;
  title: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

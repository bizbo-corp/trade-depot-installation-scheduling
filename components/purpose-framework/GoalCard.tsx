import { cn } from "@/lib/utils";

interface GoalCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function GoalCard({ title, description, icon, className }: GoalCardProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-xs font-semibold text-muted-foreground">Goal</span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}








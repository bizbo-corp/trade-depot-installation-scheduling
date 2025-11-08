import { cn } from "@/lib/utils";

interface ItemProps {
  icon: string;
  text: string;
}

function Item({ icon, text }: ItemProps) {
  return (
    <div className="flex items-start gap-3">
      <i className={cn(icon, "text-foreground text-lg mt-0.5")} />
      <span className="text-sm">{text}</span>
    </div>
  );
}

interface FoundationsProps {
  className?: string;
  items: ItemProps[];
}

export function Foundations({ className, items }: FoundationsProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-duotone fa-building text-foreground text-lg" />
        <h3 className="text-lg font-semibold">Foundations</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </div>
    </div>
  );
}


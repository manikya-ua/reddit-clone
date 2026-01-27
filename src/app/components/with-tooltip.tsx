import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WithTooltip({
  children,
  tooltipText,
  side,
}: {
  children: React.ReactNode;
  tooltipText: string;
  side?: "left" | "top" | "bottom" | "right";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}

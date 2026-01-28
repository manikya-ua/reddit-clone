import type { WidgetProps } from "@rjsf/utils";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function TextareaWidget({
  value,
  className,
  rawErrors,
  placeholder,
  onChange,
}: WidgetProps) {
  return (
    <Textarea
      value={value}
      className={cn(
        "inline-block rounded-md p-4 my-4 h-auto placeholder:text-lg text-lg",
        className,
      )}
      aria-invalid={(rawErrors?.length ?? 0) > 0}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

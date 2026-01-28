import type { WidgetProps } from "@rjsf/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectWidget(props: WidgetProps) {
  return (
    <Select
      onValueChange={(val) => {
        props.onChange(val);
      }}
      value={props.value}
    >
      <SelectTrigger
        aria-invalid={(props.rawErrors?.length ?? 0) > 0}
        className="w-45"
      >
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {props.options.enumOptions?.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

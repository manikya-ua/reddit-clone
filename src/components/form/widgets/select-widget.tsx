import type { RJSFSchema, WidgetProps } from "@rjsf/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectWidget(
  props: WidgetProps<unknown, RJSFSchema, Map<number, string | null>>,
) {
  const options = props.options.enumOptions?.filter(({ label }) =>
    props.name === "sub"
      ? props.registry.formContext.has(parseInt(label, 10))
      : true,
  );
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
        {!options ||
          (options.length === 0 && (
            <SelectItem value="">Join a subreddit to post</SelectItem>
          ))}
        {options?.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {props.name === "sub"
              ? props.registry.formContext.get(parseInt(label, 10))
              : label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

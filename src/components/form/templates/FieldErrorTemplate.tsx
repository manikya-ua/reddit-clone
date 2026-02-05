import type { FieldErrorProps } from "@rjsf/utils";

export default function FieldErrorTemplate(props: FieldErrorProps) {
  if (!props.errors || props.errors.length === 0) return null;
  return (
    <div className="text-rose-500 text-xs -mt-4 ml-3">{props.errors[0]}</div>
  );
}

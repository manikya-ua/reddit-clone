import type { FieldTemplateProps } from "@rjsf/utils";
import { cn } from "@/lib/utils";

export default function FieldTemplate(props: FieldTemplateProps) {
  const { id, classNames, style, label, help, errors, children, schema } =
    props;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5",
        schema.enum !== undefined && "flex-row block w-fit mx-auto gap-5 my-3",
        classNames,
      )}
      style={style}
    >
      {schema.enum !== undefined && <label htmlFor={id}>{label}</label>}
      <div
        className={cn(
          "flex flex-col items-center gap-5 w-full",
          schema.enum !== undefined &&
            "flex-row block w-fit mx-auto gap-5 my-3",
          classNames,
        )}
      >
        {children}
      </div>
      {errors}
      {help}
    </div>
  );
}

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-10 backdrop-contrast-50 flex items-center justify-center">
      <Loader2 className="size-20 animate-spin" />
    </div>
  );
}

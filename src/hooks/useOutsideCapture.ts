import { type RefObject, useEffect } from "react";

export const useOutsideCapture = ({
  ref,
  onClickOutside,
}: {
  ref: RefObject<HTMLElement | null>;
  onClickOutside: () => void;
}) => {
  useEffect(() => {
    function onClick(e: PointerEvent) {
      if (ref.current && e.target && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });
};

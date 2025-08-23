import { useEffect, useRef } from "react";

export default function useOutsideAlerter<T extends HTMLElement>(
  setIsVisible? :(isVisible: boolean)=> void,
  setImageUrl?: (imageUrl: string)=> void
) {
  const myRef = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (myRef.current && !myRef.current.contains(event.target as Node)) {
        setIsVisible?.(false);
        setImageUrl?.("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [myRef]);

  return {ref: myRef};
}
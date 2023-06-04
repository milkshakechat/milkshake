import { useRef } from "react";
import { SendBirdService } from "@/services/sendbird";

export function useSendbird() {
  const ref = useRef<SendBirdService>();

  if (!ref.current) {
    ref.current = new SendBirdService();
  }

  return ref.current;
}

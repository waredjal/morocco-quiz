import * as Burnt from "burnt";

export function showToast(
  title: string,
  preset?: "done" | "error" | "none",
  message?: string
) {
  Burnt.toast({
    title,
    preset,
    message,
  });
}

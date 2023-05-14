import type {BaseElement} from "@kit";
import {Input, InputProps} from "@kit/input";

export function ThemeInput(props: Omit<BaseElement<InputProps>, "variant">) {
  return <Input variant="material" {...props} />;
}

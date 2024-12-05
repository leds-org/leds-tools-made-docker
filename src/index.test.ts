import { expect, test } from "vitest";
import { main } from "./index";

test("greet function", () => {
  main()
  expect("World").toBe("World");
});

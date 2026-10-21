import { expect, open, test } from "nsh/test";

test("every sidebar item opens its page", async () => {
  const app = await open("../App.tsx");
  for (const [id, title] of [
    ["layout", "Layout"],
    ["rtl", "Right to left"],
    ["inheritance", "Inheritance"],
    ["text", "Text and values"],
    ["borders", "Borders and outlines"],
    ["transforms", "Transforms"],
    ["effects", "Gradients and shadows"],
    ["object-fit", "Images: object-fit"],
    ["variants", "Variants and selection"],
    ["unknown", "Now unknown"],
    ["svg", "SVG images"],
    ["density", "Multi-resolution images"],
    ["sticky", "Sticky list headers"],
  ]) {
    await app.press(`id:nav-${id}`);
    expect(app.texts()).toContain(title);
  }
});

test("a group collapses and expands", async () => {
  const app = await open("../App.tsx");
  expect(app.texts()).toContain("Right to left");
  await app.press("id:group-tailwind");
  expect(app.texts()).not.toContain("Right to left");
  await app.press("id:group-tailwind");
  expect(app.texts()).toContain("Right to left");
});

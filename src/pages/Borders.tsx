import { View } from "nsh";
import { Compare, Page, Section } from "../ui";

const box = "size-16 bg-zinc-100 border-zinc-800 outline-sky-600";

export function Borders() {
  return (
    <Page
      title="Borders and outlines"
      intro="border-none / border-hidden are a border style that hides the border whatever the width and order. Outline style classes win over the width's solid, and alone draw CSS's medium (3px) outline."
    >
      <Section title="border-none border-2">
        <Compare
          nowCode={`class="border-none border-2"`}
          now={<View class={`${box} border-none border-2`} />}
          beforeCode={`border-none was width 0, so border-2 brought it back`}
          before={<View class={`${box} border-2`} />}
        />
      </Section>

      <Section title={`borderStyle: "none" / "hidden" (style key)`}>
        <Compare
          nowCode={`style={{ borderWidth: 3, borderStyle: "none" }}`}
          now={<View class={box} style={{ borderWidth: 3, borderStyle: "none" }} />}
          beforeCode={`style={{ borderWidth: 3 }}`}
          before={<View class={box} style={{ borderWidth: 3 }} />}
        />
      </Section>

      <Section title="outline-dashed outline-2">
        <Compare
          nowCode={`class="outline-dashed outline-2"`}
          now={<View class={`${box} outline-dashed outline-2 outline-offset-2`} />}
          beforeCode={`outline-2 forced solid`}
          before={<View class={`${box} outline-solid outline-2 outline-offset-2`} />}
        />
      </Section>

      <Section title="outline-none outline-2">
        <Compare
          nowCode={`class="outline-none outline-2"`}
          now={<View class={`${box} outline-none outline-2 outline-offset-2`} />}
          beforeCode={`outline-2 drew a 2pt outline`}
          before={<View class={`${box} outline-2 outline-offset-2`} />}
        />
      </Section>

      <Section title="outline-dashed alone">
        <Compare
          nowCode={`class="outline-dashed"`}
          now={<View class={`${box} outline-dashed outline-offset-2`} />}
          beforeCode={`width 0: nothing`}
          before={<View class={box} />}
        />
      </Section>
    </Page>
  );
}

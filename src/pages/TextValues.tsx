import { Text, View } from "nsh";
import { Compare, Note, Page, Section } from "../ui";

const PARA = "Line heights decide how far apart these lines sit. A paragraph long enough to wrap shows it best, so this one runs on for a few lines.";

export function TextValues() {
  return (
    <Page
      title="Text and values"
      intro="Unitless arbitrary line heights are multiples of the font size; leading-* beats a text size's own line height; pt is CSS's point (4/3 px); max-w-prose is 65ch of the element's font; normal-nums keeps small-caps."
    >
      <Section title="leading-[1.5]">
        <Compare
          nowCode={`class="leading-[1.5]"`}
          now={<Text class="text-sm leading-[1.5] text-zinc-800">{PARA}</Text>}
          beforeCode={`lineHeight: 1.5 (points)`}
          before={<Text class="text-sm text-zinc-800" style={{ lineHeight: 1.5 }}>{PARA}</Text>}
        />
      </Section>

      <Section title="leading-tight text-lg" note="Order and variants no longer matter: leading-* always wins over text-<size>'s line height.">
        <Compare
          nowCode={`class="leading-tight text-lg"`}
          now={<Text class="leading-tight text-lg text-zinc-800">{PARA}</Text>}
          beforeCode={`class="text-lg" (its own 1.55 line height won)`}
          before={<Text class="text-lg text-zinc-800">{PARA}</Text>}
        />
      </Section>

      <Section title="pt units" note="12pt is 16 points (CSS: 1pt = 4/3 px).">
        <Compare
          nowCode={`class="p-[12pt]"`}
          now={
            <View class="self-start bg-sky-100 p-[12pt]">
              <View class="size-8 bg-sky-500" />
            </View>
          }
          beforeCode={`class="p-[12px]"`}
          before={
            <View class="self-start bg-sky-100 p-[12px]">
              <View class="size-8 bg-sky-500" />
            </View>
          }
        />
      </Section>

      <Section
        title="max-w-prose"
        note="65 times the width of the font's 0, so it follows the font size: about 470 points for 12pt text here, where NSH used to fix it at 520 (a panel narrower than that hides the difference)."
      >
        <Compare
          nowCode={`class="max-w-prose text-xs"`}
          now={<Text class="max-w-prose text-xs text-zinc-800 bg-yellow-50">{PARA + " " + PARA}</Text>}
          beforeCode={`class="max-w-[520px] text-xs"`}
          before={<Text class="max-w-[520px] text-xs text-zinc-800 bg-yellow-50">{PARA + " " + PARA}</Text>}
        />
      </Section>

      <Section title="small-caps normal-nums">
        <Compare
          nowCode={`class="small-caps normal-nums"`}
          now={<Text class="small-caps normal-nums text-lg text-zinc-800">Small Caps 0123</Text>}
          beforeCode={`normal-nums cleared small-caps`}
          before={<Text class="text-lg text-zinc-800">Small Caps 0123</Text>}
        />
      </Section>

      <Section title="font-serif / font-mono" note="On the web these fell back to the sans font; the other platforms were already right.">
        <View class="gap-1">
          <Text class="font-serif text-lg text-zinc-800">font-serif: The quick brown fox</Text>
          <Text class="font-mono text-lg text-zinc-800">font-mono: The quick brown fox</Text>
        </View>
        <Note>Run with --target web to see the fix.</Note>
      </Section>
    </Page>
  );
}

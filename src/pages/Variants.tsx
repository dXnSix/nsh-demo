import { Text, View } from "nsh";
import { Note, Page, Section } from "../ui";

export function Variants() {
  return (
    <Page
      title="Variants and selection"
      intro="group-*: ranks before first:, last:, odd:, even:, placeholder: and selection:, as in Tailwind, so the structural variant wins when both set the same property. selection:bg-* colors the selection highlight; selection:text-* is unknown (natively the glyphs can't take a color)."
    >
      <Section
        title="group-hover vs last:"
        note="Hover the card (desktop). Each row has group-hover:opacity-50; the last one also has last:opacity-25. In a browser, last: wins: the last row stays at 25%."
      >
        <View class="group gap-2 rounded-xl border border-zinc-200 p-3">
          {["first row", "second row", "last row"].map((label) => (
            <View class="rounded-md bg-sky-500 px-3 py-2 group-hover:opacity-50 last:opacity-25">
              <Text class="text-xs font-semibold text-white">{label}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="selection:bg-violet-200" note="Select this text: the highlight is violet.">
        <Text selectable class="selection:bg-violet-200 text-base text-zinc-800">
          Select me. The selection highlight takes the selection:bg-* color, as ::selection's background does in a browser.
        </Text>
        <Note>Before, selection:text-* set this highlight and selection:bg-* did nothing.</Note>
      </Section>
    </Page>
  );
}

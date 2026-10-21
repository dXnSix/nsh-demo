import { Image, Text, View } from "nsh";
import { pixelRatio } from "nsh/device";
import density from "../../assets/density.png";
import density3x from "../../assets/density@3x.png";
import { Code, Note, Page, Section } from "../ui";

export function Density() {
  return (
    <Page
      title="Multi-resolution images"
      intro="An image imported without a density suffix ships its @1.5x–@4x siblings, and the one that fits the screen loads. The image is always laid out at the 1x size in points. Each file here has its own color: red 1x, green 2x, blue 3x."
    >
      <Section title={`import density from "./assets/density.png"`}>
        <View class="flex flex-row items-center gap-6">
          <Image src={density} />
          <View class="gap-1">
            <Text class="text-sm text-zinc-800">This screen: {pixelRatio()}× ({pixelRatio() >= 2.5 ? "expect blue 3x" : pixelRatio() >= 1.5 ? "expect green 2x" : "expect red 1x"})</Text>
            <Text class="text-sm text-zinc-800">Laid out at {density.size.width}×{density.size.height} points</Text>
            <Text class="text-sm text-zinc-800">Shipped scales: {(density.scales ?? [1]).join(", ")}</Text>
          </View>
        </View>
        <Note>The stripes at the bottom are one device pixel wide in the file that loaded: sharp alternating lines mean the right density.</Note>
      </Section>

      <Section title={`import density3x from "./assets/density@3x.png"`} note="A file imported with its suffix ships alone and is sized by it: 192 pixels at 3x are 64 points.">
        <View class="flex flex-row items-center gap-6">
          <Image src={density3x} />
          <Code>{`${density3x.size.width}×${density3x.size.height} points, scales: ${(density3x.scales ?? []).join(", ") || "none"}`}</Code>
        </View>
      </Section>

      <Section title="Scaled up" note="Drawn at 128 points: the loaded file is scaled, so a lower density looks softer.">
        <Image src={density} style={{ width: 128, height: 128 }} />
      </Section>
    </Page>
  );
}

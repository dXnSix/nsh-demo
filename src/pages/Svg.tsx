import { Image, signal, Text, View } from "nsh";
import badge from "../../assets/badge.svg";
import glyph from "../../assets/glyph.svg";
import landscape from "../../assets/landscape.svg";
import { Code, Note, Page, Section, Segmented } from "../ui";

const sizes = [16, 32, 64, 128] as const;
const modes = ["contain", "cover", "stretch", "center", "scale-down"] as const;

export function Svg() {
  const size = signal<(typeof sizes)[number]>(64);
  const mode = signal<(typeof modes)[number]>("contain");
  return (
    <Page
      title="SVG images"
      intro="<Image> shows SVG on every platform: multicolor art with gradients, strokes, clip paths and opacity, drawn natively (resvg) for the view's pixel size, so it stays sharp at any size. Tint, resize modes, blur and the load events work as with bitmaps."
    >
      <Section title="Multicolor SVG at its intrinsic size">
        <View class="flex flex-row flex-wrap items-end gap-6">
          <View class="items-center gap-1">
            <Image src={badge} />
            <Code>badge.svg (96×96)</Code>
          </View>
          <View class="items-center gap-1">
            <Image src={landscape} />
            <Code>landscape.svg (viewBox 320×160)</Code>
          </View>
          <View class="items-center gap-1">
            <Image src={glyph} />
            <Code>glyph.svg (16×16)</Code>
          </View>
        </View>
      </Section>

      <Section title="Sharp at any size" note="A 16×16 SVG drawn large stays crisp: it is rasterized for the view's pixel size.">
        <Segmented options={sizes} value={size} onChange={(v) => size.set(v)} format={(v) => `${v}pt`} />
        <View class="flex flex-row items-end gap-6">
          <Image src={glyph} style={{ width: size(), height: size() }} />
          <Image src={badge} style={{ width: size(), height: size() }} />
        </View>
      </Section>

      <Section title="Resize modes" note="landscape.svg in a square frame.">
        <Segmented options={modes} value={mode} onChange={(v) => mode.set(v)} />
        <View class="size-40 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
          <Image src={landscape} resizeMode={mode()} style={{ width: "100%", height: "100%" }} />
        </View>
      </Section>

      <Section title="Tint and blur">
        <View class="flex flex-row items-center gap-6">
          <Image src={badge} style={{ tintColor: "#0ea5e9" }} />
          <Image src={badge} blurRadius={4} />
          <Image src={badge} class="opacity-50" />
        </View>
        <Note>A tint replaces every color with one; blurRadius blurs the raster.</Note>
      </Section>

      <Section title="SVG as a class-styled element">
        <View class="flex flex-row items-center gap-4">
          <Image src={badge} class="size-12 rounded-full ring-2 ring-offset-2 ring-violet-500" />
          <Image src={badge} class="size-12 rotate-12 drop-shadow-lg" />
          <Text class="text-sm text-zinc-600">Tailwind classes apply to SVG images like any other.</Text>
        </View>
      </Section>
    </Page>
  );
}

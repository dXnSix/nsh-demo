import { Image, Text, View } from "nsh";
import large from "../../assets/large.png";
import small from "../../assets/small.png";
import { Note, Page, Section } from "../ui";

const modes = [
  { cls: "object-cover", what: "fills, cropping" },
  { cls: "object-contain", what: "fits inside" },
  { cls: "object-fill", what: "stretches" },
  { cls: "object-none", what: "natural size, cropped" },
  { cls: "object-scale-down", what: "natural size, shrunk to fit" },
];

function Grid(props: { src: typeof large; title: string }) {
  return (
    <View class="gap-2">
      <Text class="text-sm font-medium text-zinc-700">{props.title}</Text>
      <View class="flex flex-row flex-wrap gap-4">
        {modes.map((m) => (
          <View class="gap-1">
            <View class="h-28 w-44 overflow-hidden rounded-lg border border-zinc-300 bg-[repeating-linear-gradient(45deg,#f4f4f5_0_8px,#e4e4e7_8px_16px)]">
              <Image src={props.src} class={`h-full w-full ${m.cls}`} />
            </View>
            <Text class="font-mono text-xs text-zinc-800">{m.cls}</Text>
            <Text class="text-[11px] text-zinc-500">{m.what}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ObjectFit() {
  return (
    <Page
      title="Images: object-fit"
      intro="object-none is the natural size and object-scale-down the natural size shrunk to fit, the same on every platform. Before, iOS and Android drew both as natural size, and the web and desktops drew both as scale-down. resizeMode gained 'scale-down'."
    >
      <Section title="A large image (600×400) in a 176×112 frame" note="object-none must crop to the middle; object-scale-down must shrink it to fit.">
        <Grid src={large} title="large.png" />
      </Section>
      <Section title="A small image (60×40) in the same frame" note="object-none and object-scale-down must both show it at its natural size.">
        <Grid src={small} title="small.png" />
      </Section>
      <Section title={`resizeMode="scale-down" (prop)`}>
        <View class="h-28 w-44 overflow-hidden rounded-lg border border-zinc-300">
          <Image src={large} resizeMode="scale-down" style={{ width: "100%", height: "100%" }} />
        </View>
        <Note>resizeMode="center" is the natural size on every platform now.</Note>
      </Section>
    </Page>
  );
}

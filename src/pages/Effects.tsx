import { Image, View } from "nsh";
import badge from "../../assets/badge.svg";
import { Compare, Note, Page, Section } from "../ui";

export function Effects() {
  return (
    <Page
      title="Gradients and shadows"
      intro="Tailwind's gradient classes mix colors in Oklab (Tailwind emits 'in oklab'), so the middle of a blue-to-pink gradient keeps the ends' lightness (a lighter lavender) where sRGB mixing dips to a darker purple. CSS gradients in styles honor 'in <space>'. Every drop-shadow layer now reaches the filter chain."
    >
      <Section title="bg-linear-to-r from-blue-500 to-pink-500">
        <Compare
          nowCode={`class="bg-linear-to-r from-blue-500 to-pink-500" (Oklab)`}
          now={<View class="h-16 rounded-lg bg-linear-to-r from-blue-500 to-pink-500" />}
          beforeCode={`backgroundImage: "linear-gradient(to right in srgb, …)"`}
          before={
            <View class="h-16 rounded-lg" style={{ backgroundImage: "linear-gradient(to right in srgb, #2b7fff, #f6339a)" }} />
          }
        />
        <Compare
          nowCode={`class="bg-linear-to-r from-green-500 via-yellow-300 to-purple-600"`}
          now={<View class="h-16 rounded-lg bg-linear-to-r from-green-500 via-yellow-300 to-purple-600" />}
          beforeCode={`the same in srgb`}
          before={
            <View
              class="h-16 rounded-lg"
              style={{ backgroundImage: "linear-gradient(to right in srgb, #00c950, #ffdf20, #9810fa)" }}
            />
          }
        />
        <View class="flex flex-row gap-3">
          <View class="size-24 rounded-full bg-radial from-amber-300 to-rose-600" />
          <View class="size-24 rounded-full bg-conic from-sky-400 via-fuchsia-500 to-sky-400" />
        </View>
        <Note>bg-radial and bg-conic mix in Oklab too.</Note>
      </Section>

      <Section
        title="Multi-layer drop-shadow"
        note="A rose shadow above and a blue one below. The web, Linux, Windows and GPUI draw both; iOS, macOS and Android draw one shadow and keep the last layer, as before."
      >
        <Compare
          nowCode={`class="drop-shadow-[0_-8px_0_#f43f5e,0_8px_0_#3b82f6]"`}
          now={
            <View class="h-28 items-center justify-center">
              <Image src={badge} class="drop-shadow-[0_-8px_0_#f43f5e,0_8px_0_#3b82f6]" />
            </View>
          }
          beforeCode={`only the last layer`}
          before={
            <View class="h-28 items-center justify-center">
              <Image src={badge} class="drop-shadow-[0_8px_0_#3b82f6]" />
            </View>
          }
        />
      </Section>
    </Page>
  );
}

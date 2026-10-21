import { Text, View } from "nsh";
import { Chip, Compare, Note, Page, Section } from "../ui";

function Stage(props: { children: unknown }) {
  return <View class="h-28 min-w-44 items-center justify-center bg-zinc-100">{props.children as never}</View>;
}

export function Transforms() {
  return (
    <Page
      title="Transforms"
      intro="transform-none clears only the transform property (rotate-x/y/z and skews), as in Tailwind 4, where translate, rotate and scale are properties of their own; translate-none / scale-none / rotate-none clear those. rotate-z-* follows rotate-x/y. perspective-* gives the element's children depth."
    >
      <Section title="transform-none keeps translate, rotate and scale">
        <Compare
          nowCode={`class="translate-x-6 rotate-12 scale-125 skew-x-12 transform-none"`}
          now={
            <Stage>
              <Chip label="box" class="translate-x-6 rotate-12 scale-125 skew-x-12 transform-none" />
            </Stage>
          }
          beforeCode={`everything cleared`}
          before={
            <Stage>
              <Chip label="box" />
            </Stage>
          }
        />
        <View class="flex flex-row flex-wrap gap-6 items-center">
          <Stage>
            <Chip label="translate-none" class="translate-x-8 rotate-12 translate-none" color="bg-amber-500" />
          </Stage>
          <Stage>
            <Chip label="scale-none" class="scale-150 rotate-12 scale-none" color="bg-amber-500" />
          </Stage>
          <Stage>
            <Chip label="rotate-none" class="rotate-45 translate-x-4 rotate-none" color="bg-amber-500" />
          </Stage>
        </View>
        <Note>Each amber box sets a second transform that should survive the *-none class.</Note>
      </Section>

      <Section title="rotate-z-* composes with rotate-*" note="rotate-12 rotate-z-30 turns 42°; before, rotate-z replaced rotate (30°).">
        <Compare
          nowCode={`class="rotate-12 rotate-z-30"`}
          now={
            <Stage>
              <Chip label="42°" class="rotate-12 rotate-z-30" color="bg-violet-500" />
            </Stage>
          }
          beforeCode={`class="rotate-30"`}
          before={
            <Stage>
              <Chip label="30°" class="rotate-[30deg]" color="bg-violet-500" />
            </Stage>
          }
        />
      </Section>

      <Section title="perspective-* is the children's depth" note="CSS's perspective property: it gives the children depth, not the element itself.">
        <Compare
          nowCode={`<View class="perspective-near"><View class="rotate-x-50"/>`}
          now={
            <Stage>
              <View class="perspective-near">
                <View class="h-16 w-32 rotate-x-50 items-center justify-center bg-sky-500">
                  <Text class="text-xs text-white">child in depth</Text>
                </View>
              </View>
            </Stage>
          }
          beforeCode={`the parent's class did nothing for the child`}
          before={
            <Stage>
              <View>
                <View class="h-16 w-32 rotate-x-50 items-center justify-center bg-sky-500">
                  <Text class="text-xs text-white">flat</Text>
                </View>
              </View>
            </Stage>
          }
        />
        <Note>Before, perspective-near rotate-x-50 on the same element gave that element depth; now that combination is flat, as in a browser.</Note>
      </Section>
    </Page>
  );
}

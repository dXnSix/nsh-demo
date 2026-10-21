import { signal, Text, View } from "nsh";
import { Avatar, Chip, Compare, Note, Page, Section } from "../ui";

export function Layout() {
  const showFixed = signal(false);
  return (
    <Page
      title="Layout"
      intro="Display and position classes now lay out as in a browser: inline boxes are blocks inside flex and grid parents, static ignores its insets, fixed sits in the window, and space-x/y are margins on the children."
    >
      <Section
        title="inline-block / inline"
        note="Inside a flex or grid parent a browser lays an inline box out as a block, so its own gap and items-* do nothing. NSH used to make it a flex column, where they applied."
      >
        <Compare
          nowCode={`class="inline-block gap-4 items-center"`}
          now={
            <View class="inline-block gap-4 items-center bg-amber-50">
              <Chip label="A" />
              <Chip label="B" color="bg-violet-500" />
            </View>
          }
          beforeCode={`style={{ flexDirection: "column", gap: 16, alignItems: "center" }}`}
          before={
            <View class="bg-amber-50" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
              <Chip label="A" />
              <Chip label="B" color="bg-violet-500" />
            </View>
          }
        />
      </Section>

      <Section title="static" note="A static box stays in the flow and ignores top / left. NSH used to treat it as relative and shift it.">
        <Compare
          nowCode={`class="static top-6 left-10"`}
          now={
            <View class="h-24 bg-zinc-100">
              <Chip label="static" class="static top-6 left-10 self-start" color="bg-rose-500" />
            </View>
          }
          beforeCode={`class="relative top-6 left-10"`}
          before={
            <View class="h-24 bg-zinc-100">
              <Chip label="static" class="relative top-6 left-10 self-start" color="bg-rose-500" />
            </View>
          }
        />
      </Section>

      <Section
        title="fixed"
        note="A fixed box is placed in the window, wherever it is in the tree, and stays there while its parent scrolls. NSH used to treat it as absolute in its parent. Toggle it: the 'now' badge appears at the window's bottom right corner."
      >
        <View onPress={() => showFixed.set(!showFixed())} class="self-start rounded-md bg-zinc-900 px-3 py-2">
          <Text class="text-xs font-semibold text-white">{showFixed() ? "Hide the fixed badges" : "Show the fixed badges"}</Text>
        </View>
        <Compare
          nowCode={`class="fixed bottom-6 right-6"`}
          now={
            <View class="h-24 bg-zinc-100">
              <Text class="text-xs text-zinc-500">The badge is in the window's corner, not here.</Text>
              {showFixed() ? <Chip label="fixed: window corner" class="fixed bottom-6 right-6 shadow-lg" color="bg-emerald-600" /> : null}
            </View>
          }
          beforeCode={`class="absolute bottom-6 right-6"`}
          before={
            <View class="h-24 bg-zinc-100">
              {showFixed() ? <Chip label="old fixed: in the parent" class="absolute bottom-2 right-2" color="bg-zinc-500" /> : null}
            </View>
          }
        />
      </Section>

      <Section
        title="space-x-* / space-y-*"
        note="Margins on every child but the last, as Tailwind generates them, not a gap. They add to a gap and also work in block parents."
      >
        <Compare
          nowCode={`class="flex gap-2 space-x-6"`}
          now={
            <View class="flex gap-2 space-x-6">
              <Chip label="1" />
              <Chip label="2" />
              <Chip label="3" />
            </View>
          }
          beforeCode={`style={{ columnGap: 24 }} (space-x replaced the gap)`}
          before={
            <View class="flex" style={{ columnGap: 24 }}>
              <Chip label="1" />
              <Chip label="2" />
              <Chip label="3" />
            </View>
          }
        />
        <Compare
          nowCode={`class="block space-y-3"`}
          now={
            <View class="block space-y-3">
              <Chip label="1" color="bg-indigo-500" />
              <Chip label="2" color="bg-indigo-500" />
              <Chip label="3" color="bg-indigo-500" />
            </View>
          }
          beforeCode={`class="block" (a gap does nothing in block layout)`}
          before={
            <View class="block">
              <Chip label="1" color="bg-indigo-500" />
              <Chip label="2" color="bg-indigo-500" />
              <Chip label="3" color="bg-indigo-500" />
            </View>
          }
        />
      </Section>

      <Section title="-space-x-* (overlapping avatars)" note="Negative space overlaps the children. NSH used to drop the minus sign and spread them apart.">
        <Compare
          nowCode={`class="flex -space-x-3"`}
          now={
            <View class="flex -space-x-3">
              <Avatar label="AL" color="bg-rose-500" />
              <Avatar label="BK" color="bg-amber-500" />
              <Avatar label="CM" color="bg-emerald-500" />
              <Avatar label="DS" color="bg-sky-500" />
            </View>
          }
          beforeCode={`style={{ columnGap: 12 }}`}
          before={
            <View class="flex" style={{ columnGap: 12 }}>
              <Avatar label="AL" color="bg-rose-500" />
              <Avatar label="BK" color="bg-amber-500" />
              <Avatar label="CM" color="bg-emerald-500" />
              <Avatar label="DS" color="bg-sky-500" />
            </View>
          }
        />
        <Note>space-x-reverse puts the margins on the other side, for flex-row-reverse.</Note>
      </Section>
    </Page>
  );
}

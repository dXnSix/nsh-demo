# NSH demo

An app for trying NSH features by hand: a sidebar of feature groups (Tailwind, SVG, Images, Lists) that expand and
collapse, and the selected feature's page in the middle. Each
Tailwind page compares what a class does now ("Now", its browser meaning) with what NSH did before (drawn with styles
that reproduce the old result).

It lives outside the NSH repository on purpose, so it never ends up in an upstream PR, and it depends on no particular
NSH checkout: **the `nsh` binary you start it with decides which NSH you test.** Point any checkout's or worktree's
`nsh` at this folder; no symlinks or copies are needed.

## Start it

Build the CLI in the NSH checkout or worktree you want to test (once, and after pulling or changing its Rust code):

```bash
cd path/to/nsh
cargo build -p nsh-cli
```

Then run the demo with **that build's `nsh`, by its full path** (hot reload: saving a file here updates the app):

```bash
path/to/nsh/target/debug/nsh run path/to/nsh-demo --target macos --window-size 1440x900
```

`--window-size 1440x900` opens the macOS window centered at that size (without it, 1200×800), wide enough for
the sidebar and the side-by-side panels. It works for `--target macos`, `windows`, `linux` and `gpui`.

Don't run a bare `nsh` (or `NSH`: macOS file names ignore case): that is whatever `nsh` is on your `PATH`, such as an
older one in `~/.cargo/bin`. Such a build warns about classes it doesn't know yet (`unknown class translate-none`) and
fails with `nsh-macos-host for macos not found at ~/.cargo/bin/...`, because the hosts are only built inside a checkout.

To type less, add a shell alias for the build you test (in `~/.zshrc`, or just for the current terminal):

```bash
alias nshp=path/to/nsh/target/debug/nsh
```

Other targets:

```bash
nshp run path/to/nsh-demo --target web       # in the browser
nshp run path/to/nsh-demo --target ios       # iOS simulator (needs the nsh-ios-host sim build)
nshp run path/to/nsh-demo --target android   # emulator / device (needs `cargo xtask android --dev`)
nshp run path/to/nsh-demo                    # Catalyst (the default on macOS; a phone-sized window)
```

The first `run` for a target builds that target's development host in the checkout, which takes a while.

To test another NSH (the fork's `main`, another worktree), use that checkout's `target/debug/nsh` the same way, after
`cargo build -p nsh-cli` there.

## Check it

```bash
nshp check path/to/nsh-demo   # type check
nshp test path/to/nsh-demo    # headless: every sidebar item opens its page
```

The "Now unknown" page uses classes NSH refuses on purpose; the warnings for them (`unknown classes: sticky`, ...) are
expected.

## Build for the web

```bash
nshp package --target web -o output path/to/nsh-demo
```

This writes a static site to `output/NSH Demo/` (`index.html` and files named by their content, relative paths, so any
web server or subpath works; `--run` also serves it locally). Building the web runtime needs a clang that targets wasm32
and `llvm-ar`: on macOS, Homebrew's (`brew install llvm`, then
`CC_wasm32_unknown_unknown=$(brew --prefix llvm)/bin/clang AR_wasm32_unknown_unknown=$(brew --prefix llvm)/bin/llvm-ar`
before the command); Apple's clang does not target wasm32.

Every push to `main` builds and deploys it to GitHub Pages (`.github/workflows/pages.yml`): it builds `nsh-cli` from
the NSH fork at the branch `NSH_REF` names, checks and tests the demo, then packages it. To try another NSH branch, run
the workflow by hand (Actions → Pages → Run workflow) with that branch.

## Add a feature

1. Add `src/pages/<Feature>.tsx`, built from `src/ui.tsx` (`Page`, `Section`, `Compare` for now / before pairs, `Code`, `Note`,
   `Segmented`).
2. Add an entry to its group's `features` in `groups` in `src/App.tsx` (an `id`, a name, a one-line detail, the page), or a
   new group (`id`, `title`, `features`), and the feature's id to the list in `src/App.test.tsx`.
3. Put images under `assets/` at the root (a page imports them as `../../assets/name.png`) (`name.png` with `name@2x.png` / `name@3x.png` siblings ship as one multi-resolution image).

## Pages

| Group | Page | Shows |
|---|---|---|
| Tailwind | Layout | `inline` / `inline-block` as blocks, `static` ignoring insets, `fixed` in the window, `space-x/y-*` as margins, `-space-x-*` overlap |
| | Right to left | physical classes stay put in RTL, logical ones follow it |
| | Inheritance | `whitespace-nowrap` / `select-text` on containers, `pointer-events-none` with a `pointer-events-auto` child, currentColor borders / outlines / rings |
| | Text and values | `leading-[1.5]`, `leading-*` over `text-*`, `pt`, `max-w-prose` (65ch), `small-caps normal-nums`, `font-serif` / `font-mono` (web) |
| | Borders and outlines | `border-none border-2`, `borderStyle: "none"`, outline styles over widths, `outline-dashed` alone |
| | Transforms | `transform-none`, `translate-none` / `scale-none` / `rotate-none`, `rotate-z-*`, `perspective-*` on the parent |
| | Gradients and shadows | Oklab vs sRGB gradients, radial / conic, multi-layer `drop-shadow` |
| | Images: object-fit | every `object-*` with a large and a small image, `resizeMode="scale-down"` |
| | Variants and selection | `group-hover:` vs `last:`, `selection:bg-*` |
| | Now unknown | classes that now warn and set nothing |
| SVG | SVG images | multicolor SVGs, sharp at any size, resize modes, tint, blur, classes |
| Images | Multi-resolution images | `@1x` / `@2x` / `@3x` siblings (red / green / blue), the screen's pixel ratio |
| Lists | Sticky list headers | `stickyHeaderIndices` + `stickyHeaderOffset` under a translucent bar (0, 44, -12) |

`assets/` holds generated test images: `density*.png` (64×64 points, one color per density, one-device-pixel stripes),
`large.png` (600×400) and `small.png` (60×40), and the multicolor SVGs `badge.svg`, `landscape.svg` and `glyph.svg`.

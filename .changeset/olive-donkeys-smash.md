---
"@templatical/types": minor
"@templatical/renderer": minor
"@templatical/editor": minor
"@templatical/import-html": minor
"@templatical/import-unlayer": minor
"@templatical/import-beefree": minor
---

Image blocks take a corner radius

Sections, section wrappers and buttons can round their corners. Images could not, so there was no way to build a round avatar or portrait. The usual workaround — a rounded section behind the image — rounds the section and leaves the image's square corners sitting on top of it.

`ImageBlock.borderRadius` is a new optional number of pixels. Leave it out (or set `0`) for square corners, which is what every existing block already renders, so nothing changes for templates that don't ask for a radius.

For a circle, use a square image and a radius of at least half its width. `999` is the usual shorthand.

The three importers now read a px `border-radius` off an image, so a rounded avatar survives the trip across. A percentage radius like `50%` comes in as no radius, since the block only stores pixels.

One caveat: Outlook on Windows ignores `border-radius` and shows square corners. Treat it as a nice-to-have rather than something a layout depends on.

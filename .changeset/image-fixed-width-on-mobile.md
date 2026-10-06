---
"@templatical/renderer": patch
---

An image or video set narrower than its column keeps its width on mobile. `fluid-on-mobile` was a global `mj-image` default, so a 120px logo or icon grew to fill its column on a phone. It is now set only on images and video thumbnails that fill their column: `width: "full"`, or a pixel width at least the room MJML gives the image, which is the column less the side padding and border of the section and wrapper around it and of the block itself. Images wider than the screen still shrink to fit, as before.

A custom `blockRenderers` entry that emits its own `mj-image` no longer inherits the attribute. Add `fluid-on-mobile="true"` to it if the image should fill its column on mobile.

`RenderContext` gains `contentWidth`, the width MJML actually gives a column's content. `containerWidth` keeps its value, the column's share of the body width.

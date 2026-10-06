import { describe, expect, it } from "vitest";
import mjml2html from "mjml";
import {
  createDefaultTemplateContent,
  createImageBlock,
  createSectionBlock,
  createVideoBlock,
  uniformBorder,
  type Block,
  type ImageBlock,
} from "@templatical/types";
import { renderToMjml } from "../src";

/**
 * MJML's `fluid-on-mobile` widens an image to its column on a phone. That is
 * right for an image that fills its column, `"full"` or a pixel width at least
 * the column's, and wrong for one set narrower: a 120px logo would grow to the
 * whole column. Video thumbnails compile to `mj-image` too
 * and follow the same rule. These render a full document, so an
 * `<mj-attributes>` default is covered as well, and assert on the class MJML
 * compiles the attribute into.
 */

async function compile(block: Block): Promise<string> {
  const content = createDefaultTemplateContent();
  content.blocks = [block];
  const result = await mjml2html(await renderToMjml(content));
  expect(result.errors).toEqual([]);
  return result.html;
}

describe("image fluid-on-mobile", () => {
  it("lets a full-width image fill its column on a phone", async () => {
    const html = await compile(
      createImageBlock({ src: "https://example.com/photo.jpg", width: "full" }),
    );

    expect(html).toContain('class="mj-full-width-mobile"');
  });

  it("keeps an image set to a width at that width on a phone", async () => {
    const html = await compile(
      createImageBlock({ src: "https://example.com/logo.png", width: 120 }),
    );

    expect(html).toContain('width="120"');
    expect(html).not.toContain('class="mj-full-width-mobile"');
  });

  it("treats a pixel width that fills a stacking column as full width", async () => {
    const FLUID = 'class="mj-full-width-mobile"';
    const inColumn = (width: number, wrapperSide = 0) =>
      createSectionBlock({
        columns: "2",
        children: [
          [createImageBlock({ src: "https://example.com/a.jpg", width })],
          [],
        ],
        wrapper: wrapperSide
          ? {
              padding: {
                top: 0,
                right: wrapperSide,
                bottom: 0,
                left: wrapperSide,
              },
            }
          : undefined,
      });

    // The section's 20px side padding leaves each of two columns 280px of a
    // 600px body, and the image's 10px side padding leaves it 260px: MJML
    // draws any wider image at 260px, so from 260px on it fills its column.
    expect(await compile(inColumn(600))).toContain(FLUID);
    expect(await compile(inColumn(260))).toContain(FLUID);
    expect(await compile(inColumn(259))).not.toContain(FLUID);
    expect(await compile(inColumn(120))).not.toContain(FLUID);

    // The image's own border narrows its room too: 4px a side leaves 252px.
    const bordered = (width: number) => {
      const section = inColumn(width);
      const image = section.children[0][0] as ImageBlock;
      image.border = uniformBorder({ width: 4, style: "solid", color: "#000" });
      return section;
    };
    expect(await compile(bordered(252))).toContain(FLUID);
    expect(await compile(bordered(251))).not.toContain(FLUID);

    // A 50px wrapper on each side narrows the column to 230px, the image to 210px.
    expect(await compile(inColumn(210, 50))).toContain(FLUID);
    expect(await compile(inColumn(209, 50))).not.toContain(FLUID);
  });

  it("treats a video thumbnail the same way", async () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    expect(await compile(createVideoBlock({ url, width: "full" }))).toContain(
      'class="mj-full-width-mobile"',
    );
    expect(await compile(createVideoBlock({ url, width: 200 }))).not.toContain(
      'class="mj-full-width-mobile"',
    );
  });
});

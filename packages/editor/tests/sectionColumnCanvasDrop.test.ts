// @vitest-environment happy-dom
import "./dom-stubs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VueDraggable } from "vue-draggable-plus";
import { useEditor } from "@templatical/core";
import {
  createDefaultTemplateContent,
  createSectionBlock,
  createSpacerBlock,
} from "@templatical/types";
import enTranslations from "../src/i18n/locales/en";
import { EDITOR_KEY, TRANSLATIONS_KEY } from "../src/keys";
import { mountEditor } from "./helpers/mount";
import SectionBlock from "../src/components/blocks/SectionBlock.vue";

/**
 * Sortable computes a drop's index with the `draggable` selector of the list
 * the drag started in, counting the dropped element's previous siblings that
 * match it. For a block dragged from the canvas into a section column, that's
 * the canvas's selector, so each block in the column must match it. When they
 * didn't, the count was always 0 and the block landed first in the column.
 */

const CANVAS_DRAGGABLE = readFileSync(
  resolve(__dirname, "../src/components/Canvas.vue"),
  "utf-8",
).match(/:draggable="'([^']+)'"/)![1];

describe("section column drop from the canvas", () => {
  it("gives each block in a column the canvas's draggable selector", () => {
    const blocks = [
      createSpacerBlock({ height: 8 }),
      createSpacerBlock({ height: 8 }),
    ];
    const section = createSectionBlock({
      columns: "2",
      children: [blocks, []],
    });
    const content = createDefaultTemplateContent();
    content.blocks = [section];
    const wrapper = mountEditor(SectionBlock, {
      props: { block: section, viewport: "desktop" },
      provides: {
        [EDITOR_KEY]: useEditor({ content }),
        [TRANSLATIONS_KEY]: enTranslations,
      },
    });
    const column = wrapper.findAllComponents(VueDraggable)[0].element;

    for (const block of blocks) {
      const item = column.querySelector(`[data-block-id="${block.id}"]`)!;
      // The list's direct child holding this block: what Sortable counts.
      let child: Element = item;
      while (child.parentElement !== column) child = child.parentElement!;
      expect(child.matches(CANVAS_DRAGGABLE)).toBe(true);
    }
  });
});

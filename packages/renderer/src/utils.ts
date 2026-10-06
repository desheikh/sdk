/**
 * MJML attribute helpers — single source of truth for placement rules
 * that the MJML spec enforces but accepts silently when violated.
 *
 * MJML drops unrecognized attributes without error. The most common trap is
 * background placement: only `mj-section`, `mj-button`, `mj-wrapper`, `mj-hero`
 * accept the native `background-color` attribute. Inner content elements
 * (`mj-text`, `mj-image`, `mj-table`, `mj-navbar`, `mj-video`) require
 * `container-background-color`, which paints the enclosing `<td>`. Passing
 * `background-color` to an inner element results in the attribute being
 * silently dropped — the email ships without the bg.
 *
 * https://documentation.mjml.io/
 */

import type {
  BorderRadiusValue,
  BorderValue,
  SpacingValue,
} from "@templatical/types";
import {
  toBorderCss,
  toBorderDeclarations,
  toBorderRadiusCss,
} from "@templatical/types";
import { escapeCssValue } from "./escape";

/**
 * Where the MJML element accepts a background-color attribute.
 * - `native`: the element has its own `background-color` (mj-section, mj-button).
 * - `container`: the element only accepts `container-background-color`,
 *   which colors the wrapping `<td>` (mj-text, mj-image, mj-table, mj-navbar, mj-video).
 */
export type BgPlacement = "native" | "container";

/**
 * Render the appropriate background-color attribute for an MJML element.
 * Returns an empty string when no color is set, or a leading-space attribute
 * fragment ready to interpolate into a tag's attribute list.
 */
export function bgAttr(
  backgroundColor: string | undefined,
  placement: BgPlacement,
): string {
  if (!backgroundColor) {
    return "";
  }

  const name =
    placement === "native" ? "background-color" : "container-background-color";

  return ` ${name}="${backgroundColor}"`;
}

/**
 * Render `mj-image`'s height attribute. Returns an empty string when no height
 * is set, so MJML applies its own `auto` and the image keeps its aspect ratio.
 *
 * The px suffix is not cosmetic: `height` is a Unit attribute accepting only
 * `px` or `auto`, so a bare number is a validation error and MJML drops it.
 * Non-finite or non-positive values are treated as unset — a `0` here would
 * collapse the image rather than express "no opinion".
 */
export function heightAttr(height: number | undefined): string {
  if (typeof height !== "number" || !Number.isFinite(height) || height <= 0) {
    return "";
  }

  return ` height="${height}px"`;
}

/**
 * The width an element's side padding and border take from the box its
 * children get, which is how MJML narrows a section's or wrapper's columns.
 */
export function horizontalInset(
  padding: SpacingValue | undefined,
  border?: BorderValue,
): number {
  const borderWidth = (side: BorderValue["left"] | undefined) =>
    side && toBorderCss(side) !== null ? side.width : 0;
  return (
    (padding?.left ?? 0) +
    (padding?.right ?? 0) +
    borderWidth(border?.left) +
    borderWidth(border?.right)
  );
}

/**
 * `fluid-on-mobile` for an `mj-image`, set only on one that fills its column:
 * `"full"`, or a pixel width at or beyond the room MJML gives it, where MJML
 * caps it: the column less the image's own side padding and border. It widens
 * the image to the stacked column on a phone, which is wrong for one set
 * narrower (a 120px logo would grow to the whole column). An image wider than
 * the phone shrinks to fit without it.
 *
 * Pass `context.contentWidth`, which already excludes the insets of the
 * sections and wrappers around the column.
 */
export function fluidOnMobileAttr(
  width: "full" | number,
  contentWidth: number,
  padding: SpacingValue,
  border?: BorderValue,
): string {
  const boxWidth = contentWidth - horizontalInset(padding, border);
  return width === "full" || width >= boxWidth ? ' fluid-on-mobile="true"' : "";
}

/**
 * Render the border attributes for the MJML elements that accept them natively
 * (`mj-section`, `mj-image`, `mj-button`): a single `border` when it covers all
 * four sides, otherwise one `border-<side>` per chosen side. Returns an empty
 * string when there is nothing to draw, so templates without a border render
 * exactly as before.
 *
 * MJML copies the values into an inline `style`, so they go through
 * `escapeCssValue` — a tampered color must not smuggle in a sibling
 * declaration.
 */
export function borderAttr(border: BorderValue | undefined): string {
  return Object.entries(toBorderDeclarations(border))
    .map(([name, value]) => ` ${name}="${escapeCssValue(value)}"`)
    .join("");
}

/**
 * Render the `border-radius` attribute: `"8px"` for matching corners, or the
 * four-value shorthand (top-left, top-right, bottom-right, bottom-left) that
 * `mj-section`, `mj-wrapper`, `mj-image` and `mj-button` all accept. Returns an
 * empty string when every corner is square, rather than a `border-radius="0px"`
 * every existing template would suddenly grow.
 */
export function borderRadiusAttr(
  radius: BorderRadiusValue | undefined,
): string {
  const css = toBorderRadiusCss(radius);

  if (css === null) {
    return "";
  }

  return ` border-radius="${css}"`;
}

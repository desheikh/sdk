---
"@templatical/editor": patch
---

The font pickers show the font in use when they don't offer it. A font the picker doesn't list, such as one from imported content or a built-in excluded by `builtIns`, or a stack written by the API or an agent, such as `Georgia, serif`, matched no option. The block toolbars' select showed blank, the paragraph toolbar's showed "Default", and Template Settings showed the default font while the email rendered another. A stack whose first family is listed now selects that family's option; any other font is listed first, labelled by its first family. A CSS-wide keyword such as `inherit`, or a blank value, shows as no font: the select's own option for that, such as "Use template font" or "Default".

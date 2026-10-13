---
"@templatical/editor": patch
---

A block dragged from the canvas into a section column that already has blocks now lands where it's dropped. It always landed first in the column, because Sortable counts a drop's position with the selector of the list the drag started in, and the column's blocks didn't match the canvas's `.tpl-block-item`. Drops from the block palette and moves between columns were already right.

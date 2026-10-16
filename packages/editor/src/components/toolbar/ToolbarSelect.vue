<script setup lang="ts">
import { computed } from "vue";
import { selectValue, withoutImportant } from "../../utils/cssValue";

interface OptionItem {
  value: string;
  label: string;
}

const props = defineProps<{
  modelValue: string;
  options: readonly (string | OptionItem)[];
  label: string;
  placeholder?: string;
  widthClass?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function onChange(e: Event): void {
  emit("update:modelValue", (e.target as HTMLSelectElement).value);
}

function optionValue(opt: string | OptionItem): string {
  return typeof opt === "string" ? opt : opt.value;
}

function optionLabel(opt: string | OptionItem): string {
  return typeof opt === "string" ? opt : opt.label;
}

const boundValue = computed(() => selectValue(props.modelValue));

// Imported or pasted text can carry a value the presets don't offer (15px,
// a 1.3 line height). Listing it first keeps the select showing what's
// applied instead of going blank.
const listedOptions = computed<readonly (string | OptionItem)[]>(() => {
  const value = boundValue.value;
  if (value === "" || props.options.some((opt) => optionValue(opt) === value)) {
    return props.options;
  }
  return [{ value, label: withoutImportant(value) }, ...props.options];
});
</script>

<template>
  <select
    :class="[
      'tpl:h-8 tpl:cursor-pointer tpl:rounded tpl:border tpl:border-[var(--tpl-border)] tpl:bg-[var(--tpl-bg)] tpl:px-2 tpl:text-xs tpl:text-[var(--tpl-text)] tpl:outline-none tpl:focus:border-[var(--tpl-primary)] tpl:focus:shadow-[var(--tpl-ring)]',
      widthClass ?? 'tpl:w-20',
    ]"
    :value="boundValue"
    :aria-label="label"
    :title="label"
    @change="onChange"
  >
    <option value="">{{ placeholder ?? "" }}</option>
    <option
      v-for="opt in listedOptions"
      :key="optionValue(opt)"
      :value="optionValue(opt)"
    >
      {{ optionLabel(opt) }}
    </option>
  </select>
</template>

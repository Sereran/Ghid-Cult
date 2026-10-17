<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Extension } from '@tiptap/core'

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Palette,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Minus,
  RemoveFormatting,
  Undo,
  Redo,
  Check,
} from '@lucide/vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {}
              return { style: `font-size: ${attrs.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
      },
    }
  },
})

// Palette Options
const textColors = [
  '#ffffff', '#94a3b8', '#34d399', '#38bdf8', '#a855f7', '#facc15', '#f87171', '#fb923c'
]

const highlightColors = [
  '#fef08a', // Yellow highlight
  '#bbf7d0', // Green highlight
  '#bae6fd', // Blue highlight
  '#fbcfe8', // Pink highlight
  '#fed7aa', // Orange highlight
  '#e9d5ff', // Purple highlight
]

const fontSizes = [
  { label: '11', value: '11px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '24', value: '24px' },
  { label: '32', value: '32px' },
]

// Dropdown Popover Toggles
const showStyleDropdown = ref(false)
const showTextColorPicker = ref(false)
const showHighlightPicker = ref(false)
const showAlignDropdown = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    TextStyle,
    Color,
    Underline,
    Highlight.configure({ multicolor: true }),
    FontSize,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
  ] as any[],
  editorProps: {
    attributes: {
      class: 'prose prose-invert prose-emerald max-w-none px-8 sm:px-16 py-12 min-h-[750px] outline-none focus:outline-none text-base leading-relaxed',
    },
  },
  onUpdate: () => {
    if (!editor.value) return
    emit('update:modelValue', editor.value.getHTML())
  },
})

// Active style display text
const currentHeadingLabel = computed(() => {
  if (!editor.value) return 'Normal text'
  if (editor.value.isActive('heading', { level: 1 })) return 'Heading 1'
  if (editor.value.isActive('heading', { level: 2 })) return 'Heading 2'
  if (editor.value.isActive('heading', { level: 3 })) return 'Heading 3'
  return 'Normal text'
})

const applyHeading = (type: string, level?: number) => {
  if (!editor.value) return
  if (type === 'paragraph') {
    editor.value.chain().focus().setParagraph().run()
  } else if (level) {
    editor.value.chain().focus().toggleHeading({ level: level as any }).run()
  }
  showStyleDropdown.value = false
}

// Sync modelValue from external changes
watch(() => props.modelValue, (val) => {
  const isSame = editor.value?.getHTML() === val
  if (!isSame && editor.value) {
    editor.value.commands.setContent(val || '', { emitUpdate: false })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="border border-white/10 rounded-xl bg-neutral-900/60 overflow-hidden focus-within:border-emerald-400 transition-colors flex flex-col w-full relative">
    
    <!-- Main Toolbar -->
    <div 
      v-if="editor" 
      class="sticky top-0 z-30 flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#020b0a]/95 backdrop-blur-md text-xs text-slate-300 select-none"
    >
      <!-- History -->
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="p-1.5 rounded hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
        title="Undo (Ctrl+Z)"
      >
        <Undo :size="15" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="p-1.5 rounded hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
        title="Redo (Ctrl+Y)"
      >
        <Redo :size="15" />
      </button>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Headings and Styles Menu -->
      <div class="relative">
        <button
          type="button"
          @click="showStyleDropdown = !showStyleDropdown; showTextColorPicker = false; showHighlightPicker = false; showAlignDropdown = false"
          class="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
        >
          <span>{{ currentHeadingLabel }}</span>
          <ChevronDown :size="12" class="opacity-60" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showStyleDropdown"
          class="absolute left-0 top-full mt-1.5 z-50 w-56 bg-[#121214] border border-white/15 rounded-xl p-1.5 shadow-2xl flex flex-col divide-y divide-white/5 text-slate-200"
        >
          <!-- Normal text -->
          <button
            type="button"
            @click="applyHeading('paragraph')"
            class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-left text-sm"
          >
            <span>Normal text</span>
            <Check v-if="!editor.isActive('heading')" :size="14" class="text-emerald-400" />
          </button>

          <!-- Heading 1 (Title) -->
          <button
            type="button"
            @click="applyHeading('heading', 1)"
            class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-left font-bold text-xl"
          >
            <span>Title / Heading 1</span>
            <Check v-if="editor.isActive('heading', { level: 1 })" :size="14" class="text-emerald-400" />
          </button>

          <!-- Heading 2 -->
          <button
            type="button"
            @click="applyHeading('heading', 2)"
            class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-left font-bold text-base"
          >
            <span>Heading 2</span>
            <Check v-if="editor.isActive('heading', { level: 2 })" :size="14" class="text-emerald-400" />
          </button>

          <!-- Heading 3 -->
          <button
            type="button"
            @click="applyHeading('heading', 3)"
            class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-left font-semibold text-sm"
          >
            <span>Heading 3</span>
            <Check v-if="editor.isActive('heading', { level: 3 })" :size="14" class="text-emerald-400" />
          </button>
        </div>
      </div>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Font Size Selector -->
      <select
        @change="(e: any) => (editor as any).chain().focus().setFontSize(e.target.value).run()"
        class="bg-[#121214] border border-white/10 text-slate-200 text-xs rounded px-2 py-1 outline-none cursor-pointer hover:border-white/20 transition-colors"
        title="Font size"
      >
        <option value="" disabled selected>Size</option>
        <option v-for="size in fontSizes" :key="size.value" :value="size.value">
          {{ size.label }}
        </option>
      </select>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Text Formatting -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('bold') ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Bold (Ctrl+B)"
      >
        <Bold :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('italic') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Italic (Ctrl+I)"
      >
        <Italic :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('underline') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('strike') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Strikethrough"
      >
        <Strikethrough :size="15" />
      </button>

      <!-- Text Color Picker -->
      <div class="relative">
        <button
          type="button"
          @click="showTextColorPicker = !showTextColorPicker; showHighlightPicker = false; showStyleDropdown = false; showAlignDropdown = false"
          class="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-0.5"
          title="Text color"
        >
          <Palette :size="15" />
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        <div
          v-if="showTextColorPicker"
          class="absolute left-0 top-full mt-2 z-50 bg-[#121214] border border-white/15 rounded-xl p-3 shadow-2xl flex flex-col gap-2 w-48"
        >
          <p class="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Text Color</p>
          <div class="grid grid-cols-4 gap-1.5">
            <button
              v-for="color in textColors"
              :key="color"
              type="button"
              @click="editor.chain().focus().setColor(color).run(); showTextColorPicker = false"
              :style="{ backgroundColor: color }"
              class="w-7 h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform"
            />
          </div>
          <button
            type="button"
            @click="editor.chain().focus().unsetColor().run(); showTextColorPicker = false"
            class="text-[11px] text-slate-400 hover:text-rose-400 text-left pt-1 border-t border-white/10"
          >
            Reset color
          </button>
        </div>
      </div>

      <!-- Highlight and Underline Marker Color -->
      <div class="relative">
        <button
          type="button"
          @click="showHighlightPicker = !showHighlightPicker; showTextColorPicker = false; showStyleDropdown = false; showAlignDropdown = false"
          class="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-0.5"
          title="Highlight color"
        >
          <Highlighter :size="15" />
          <span class="w-1.5 h-1.5 rounded-full bg-yellow-300" />
        </button>

        <div
          v-if="showHighlightPicker"
          class="absolute left-0 top-full mt-2 z-50 bg-[#121214] border border-white/15 rounded-xl p-3 shadow-2xl flex flex-col gap-2 w-48"
        >
          <p class="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Highlight Color</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="color in highlightColors"
              :key="color"
              type="button"
              @click="editor.chain().focus().toggleHighlight({ color }).run(); showHighlightPicker = false"
              :style="{ backgroundColor: color }"
              class="h-6 rounded-md border border-white/20 hover:scale-105 transition-transform"
            />
          </div>
          <button
            type="button"
            @click="editor.chain().focus().unsetHighlight().run(); showHighlightPicker = false"
            class="text-[11px] text-slate-400 hover:text-rose-400 text-left pt-1 border-t border-white/10"
          >
            None
          </button>
        </div>
      </div>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Text Alignments -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive({ textAlign: 'left' }) ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Align left"
      >
        <AlignLeft :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive({ textAlign: 'center' }) ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Align center"
      >
        <AlignCenter :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive({ textAlign: 'right' }) ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Align right"
      >
        <AlignRight :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive({ textAlign: 'justify' }) ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Justify"
      >
        <AlignJustify :size="15" />
      </button>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Indentation / Outdent -->
      <button
        type="button"
        @click="editor.chain().focus().sinkListItem('listItem').run()"
        :disabled="!editor.can().sinkListItem('listItem')"
        class="p-1.5 rounded hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
        title="Increase indent"
      >
        <Indent :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().liftListItem('listItem').run()"
        :disabled="!editor.can().liftListItem('listItem')"
        class="p-1.5 rounded hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
        title="Decrease indent"
      >
        <Outdent :size="15" />
      </button>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Lists: Checkboxes, Bullets and Numbers -->
      <button
        type="button"
        @click="editor.chain().focus().toggleTaskList().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('taskList') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Checklist"
      >
        <ListTodo :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('bulletList') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Bullet list"
      >
        <List :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('orderedList') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Numbered list"
      >
        <ListOrdered :size="15" />
      </button>

      <span class="w-px h-4 bg-white/10 mx-1" />

      <!-- Blockquote and Divider -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="['p-1.5 rounded transition-colors', editor.isActive('blockquote') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5']"
        title="Quote"
      >
        <Quote :size="15" />
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        title="Divider line"
      >
        <Minus :size="15" />
      </button>

      <!-- Clear Formatting -->
      <button
        type="button"
        @click="editor.chain().focus().unsetAllMarks().clearNodes().run()"
        class="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors ml-auto"
        title="Clear formatting"
      >
        <RemoveFormatting :size="15" />
      </button>
    </div>

    <!-- Document Canvas Area -->
    <div class="cursor-text" @click="editor?.chain().focus().run()">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style>
/* Checkbox styling for task list items */
ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

ul[data-type="taskList"] li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

ul[data-type="taskList"] li input[type="checkbox"] {
  accent-color: #10b981;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

/* Ensure highlights and underlines render clearly */
mark {
  border-radius: 0.25rem;
  padding: 0.1rem 0.25rem;
  color: #000 !important;
}
</style>
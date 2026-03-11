"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link2,
  Plus,
  HelpCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = [
  "#000000",
  "#4B5563",
  "#9CA3AF",
  "#FFFFFF",
  "#DC2626",
  "#D97706",
  "#059669",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
];

interface ColorSelectorProps {
  editor: any;
}

const ColorSelector = React.memo(({ editor }: ColorSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentColor = editor?.getAttributes("textStyle").color || "#000000";

  const handleColorChange = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
      setIsOpen(false);
    },
    [editor]
  );

  const handleReset = useCallback(() => {
    editor?.chain().focus().unsetColor().run();
    setIsOpen(false);
  }, [editor]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="h-8 gap-1 px-2 border-0 bg-transparent hover:bg-slate-100"
        >
          <div
            className="h-4 w-4 rounded-sm border border-gray-200"
            style={{ backgroundColor: currentColor }}
          />
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2 z-[9999]">
        <div className="grid grid-cols-5 gap-1 mb-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className="h-6 w-6 rounded-md border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="color-picker"
            className="text-xs text-muted-foreground"
          >
            Hex
          </label>
          <input
            id="color-picker"
            type="color"
            value={currentColor}
            onChange={(e) =>
              editor?.chain().focus().setColor(e.target.value).run()
            }
            title="Choose a custom color"
            className="h-6 w-6 p-0 border-0 rounded-md cursor-pointer"
          />
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-red-500 hover:text-red-600 ml-auto"
          >
            Reset
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
});

ColorSelector.displayName = "ColorSelector";

interface ToolbarButtonProps {
  action: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  title?: string;
}

const ToolbarButton = ({
  action,
  isActive,
  disabled,
  icon,
  title,
}: ToolbarButtonProps) => (
  <Toggle
    size="sm"
    pressed={isActive}
    onPressedChange={action}
    disabled={disabled}
    title={title}
    className="h-8 w-8 p-0 border-0 bg-transparent hover:bg-slate-100 data-[state=on]:bg-[#FDF2F8] data-[state=on]:text-[#E60076] disabled:opacity-50"
  >
    {icon}
  </Toggle>
);

interface ToolbarConfig {
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrikethrough?: boolean;
  showBulletList?: boolean;
  showOrderedList?: boolean;
  showLink?: boolean;
  showHelp?: boolean;
  showUndo?: boolean;
  showRedo?: boolean;
  showColorPicker?: boolean;
  showAlignment?: boolean;
  showInsertButton?: boolean;
}

interface ToolbarProps {
  editor: any | null;
  config: ToolbarConfig;
  onInsert?: () => void;
  onHelp?: () => void;
}

const Toolbar = ({ editor, config, onInsert, onHelp }: ToolbarProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleLinkSubmit = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  if (!editor) return null;

    const showSeparatorAfterFormatting =
      (config.showBold ||
        config.showItalic ||
        config.showUnderline ||
        config.showStrikethrough) &&
      (config.showBulletList || config.showOrderedList);

    const showSeparatorAfterLists =
      (config.showBulletList || config.showOrderedList) &&
      (config.showLink || config.showHelp || config.showColorPicker);

    const showSeparatorAfterColor =
      config.showColorPicker && config.showAlignment;

    const showSeparatorBeforeHistory =
      (config.showAlignment ||
        config.showColorPicker ||
        config.showLink ||
        config.showHelp) &&
      (config.showUndo || config.showRedo);

    return (
      <div className="flex items-center justify-between p-2 gap-2 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Formatting */}
          {config.showBold && (
            <ToolbarButton
              action={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={<Bold className="h-4 w-4" />}
              title="Bold (Ctrl+B)"
            />
          )}
          {config.showItalic && (
            <ToolbarButton
              action={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={<Italic className="h-4 w-4" />}
              title="Italic (Ctrl+I)"
            />
          )}
          {config.showUnderline && (
            <ToolbarButton
              action={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={<UnderlineIcon className="h-4 w-4" />}
              title="Underline (Ctrl+U)"
            />
          )}
          {config.showStrikethrough && (
            <ToolbarButton
              action={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              icon={<Strikethrough className="h-4 w-4" />}
              title="Strikethrough"
            />
          )}

          {showSeparatorAfterFormatting && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}

          {/* Lists */}
          {config.showBulletList && (
            <ToolbarButton
              action={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              icon={<List className="h-4 w-4" />}
              title="Bullet List"
            />
          )}
          {config.showOrderedList && (
            <ToolbarButton
              action={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              icon={<ListOrdered className="h-4 w-4" />}
              title="Numbered List"
            />
          )}

          {showSeparatorAfterLists && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}

          {/* Link */}
          {config.showLink && (
            <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
              <PopoverTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("link")}
                  className="h-8 w-8 p-0 border-0 bg-transparent hover:bg-slate-100 data-[state=on]:bg-[#FDF2F8] data-[state=on]:text-[#E60076]"
                  title="Add Link"
                >
                  <Link2 className="h-4 w-4" />
                </Toggle>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 z-[9999]" align="start">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Enter URL</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60076]"
                    onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleLinkSubmit}
                      className="flex-1"
                    >
                      Add Link
                    </Button>
                    {editor.isActive("link") && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          editor.chain().focus().unsetLink().run();
                          setShowLinkInput(false);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Help */}
          {config.showHelp && (
            <ToolbarButton
              action={() => onHelp?.()}
              icon={<HelpCircle className="h-4 w-4" />}
              title="Help"
            />
          )}

          {/* Color Picker */}
          {config.showColorPicker && <ColorSelector editor={editor} />}

          {showSeparatorAfterColor && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}

          {/* Alignment */}
          {config.showAlignment && (
            <>
              <ToolbarButton
                action={() => editor.chain().focus().setTextAlign("left").run()}
                isActive={editor.isActive({ textAlign: "left" })}
                icon={<AlignLeft className="h-4 w-4" />}
                title="Align Left"
              />
              <ToolbarButton
                action={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                isActive={editor.isActive({ textAlign: "center" })}
                icon={<AlignCenter className="h-4 w-4" />}
                title="Align Center"
              />
              <ToolbarButton
                action={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                isActive={editor.isActive({ textAlign: "right" })}
                icon={<AlignRight className="h-4 w-4" />}
                title="Align Right"
              />
              <ToolbarButton
                action={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                isActive={editor.isActive({ textAlign: "justify" })}
                icon={<AlignJustify className="h-4 w-4" />}
                title="Justify"
              />
            </>
          )}

          {showSeparatorBeforeHistory && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}

          {/* History */}
          {config.showUndo && (
            <ToolbarButton
              action={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={<Undo className="h-4 w-4" />}
              title="Undo (Ctrl+Z)"
            />
          )}
          {config.showRedo && (
            <ToolbarButton
              action={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={<Redo className="h-4 w-4" />}
              title="Redo (Ctrl+Y)"
            />
          )}
        </div>

        {config.showInsertButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onInsert}
            className="text-sm font-medium text-[#45556C] hover:text-[#0F172B] gap-1"
          >
            <Plus className="h-4 w-4" />
            Insert
          </Button>
        )}
      </div>
    );
};

// Preset configurations
const TOOLBAR_PRESETS = {
  minimal: {
    showBold: true,
    showItalic: true,
    showBulletList: true,
    showOrderedList: true,
    showLink: true,

    // showHelp: true,
    showUndo: true,
    showRedo: true,
  },
  standard: {
    showBold: true,
    showItalic: true,
    showUnderline: true,
    showStrikethrough: true,
    showBulletList: true,
    showOrderedList: true,
    showLink: true,
    showUndo: true,
    showRedo: true,
  },
  full: {
    showBold: true,
    showItalic: true,
    showUnderline: true,
    showStrikethrough: true,
    showBulletList: true,
    showOrderedList: true,
    showLink: true,
    showHelp: true,
    showUndo: true,
    showRedo: true,
    showColorPicker: true,
    showAlignment: true,
    showInsertButton: true,
  },
} as const;

type ToolbarPreset = keyof typeof TOOLBAR_PRESETS;

interface RichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (richText: string) => void;
  placeholder?: string;
  error?: boolean;

  /** Use a preset: 'minimal', 'standard', or 'full' */
  preset?: ToolbarPreset;

  /** Or customize individual toolbar options (overrides preset) */
  toolbarConfig?: Partial<ToolbarConfig>;
  onInsert?: () => void;
  onHelp?: () => void;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "eg: Type your message here",
  error = false,
  preset = "minimal",
  toolbarConfig,
  onInsert,
  onHelp,
  minHeight = "120px",
  className,
  ...props
}: RichTextEditorProps) {
  // State to force re-render when selection changes
  const [, setForceUpdate] = useState(0);

  // Merge preset with custom config
  const finalConfig: ToolbarConfig = {
    ...TOOLBAR_PRESETS[preset],
    ...toolbarConfig,
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "tiptap w-full px-[14px] py-3 text-sm bg-white",
          "placeholder:text-[#90A1B9] placeholder:italic",
          "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "overflow-y-auto prose prose-sm max-w-none",
          "prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
        ),
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();

      // Only trigger onChange if content actually changed
      if (html !== value) {
        onChange(html);
      }
    },

    // Force toolbar update when selection changes
    onSelectionUpdate() {
      setForceUpdate((prev) => prev + 1);
    },
    onTransaction() {
      setForceUpdate((prev) => prev + 1);
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Use setTimeout to avoid cursor jump issues
      const timeoutId = setTimeout(() => {
        editor.commands.setContent(value || "", { emitUpdate: false });
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [editor, value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div
      {...props}
      className={cn(
        "rounded-md border bg-white overflow-hidden transition-all",
        error ? "border-red-500" : "border-[#E2E8F0]",
        "focus-within:ring-2 focus-within:ring-[#E60076] focus-within:border-[#E60076]",
        className
      )}
    >
      <Toolbar
        editor={editor}
        config={finalConfig}
        onInsert={onInsert}
        onHelp={onHelp}
      />
      <EditorContent editor={editor} />
    </div>
  );
}

export { TOOLBAR_PRESETS };
export type { ToolbarConfig, ToolbarPreset };

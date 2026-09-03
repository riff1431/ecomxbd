"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Quote,
  Eye,
  FileCode,
  Minus,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Write product content here...",
  minHeight = "180px",
}: RichTextEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({});

  // Sync content into editable div when value changes externally (and not in HTML mode)
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === "<p><br></p>" || html === "<br>" ? "" : html);
      checkActiveFormats();
    }
  };

  const execCommand = (command: string, arg: string | undefined = undefined) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const checkActiveFormats = () => {
    if (isHtmlMode || !document) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
      });
    } catch {
      // Ignore queryCommandState errors in unsupported environments
    }
  };

  const handleInsertImage = () => {
    const url = prompt("Enter Image URL (e.g. https://... or /banners/...):");
    if (!url) return;
    const alt = prompt("Enter Image Description / Alt text (optional):") || "Product image";
    
    if (isHtmlMode) {
      const imgTag = `<img src="${url}" alt="${alt}" class="my-3 rounded-xl max-w-full h-auto border border-gray-100 shadow-xs" />`;
      onChange((value || "") + "\n" + imgTag);
    } else {
      execCommand("insertHTML", `<img src="${url}" alt="${alt}" class="my-3 rounded-xl max-w-full h-auto border border-gray-100 shadow-xs" />`);
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter Destination URL (e.g. https://... or /products/...):");
    if (!url) return;
    if (isHtmlMode) {
      const linkTag = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#e91e63] font-bold underline">${url}</a>`;
      onChange((value || "") + linkTag);
    } else {
      execCommand("createLink", url);
    }
  };

  const handleFormatHeading = (tag: "h1" | "h2" | "h3" | "p") => {
    if (isHtmlMode) {
      const headingTag = `<${tag}>Heading text</${tag}>\n`;
      onChange((value || "") + headingTag);
    } else {
      execCommand("formatBlock", `<${tag}>`);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className={cn(
              "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors",
              isHtmlMode
                ? "bg-[#111827] text-white border-[#111827]"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            )}
          >
            {isHtmlMode ? (
              <>
                <Eye className="h-3 w-3 text-pink-400" />
                <span>Visual Mode</span>
              </>
            ) : (
              <>
                <FileCode className="h-3 w-3 text-[#e91e63]" />
                <span>Edit HTML (&lt;/&gt;)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Editor Container */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs focus-within:border-[#e91e63] focus-within:ring-2 focus-within:ring-pink-500/10 transition-all">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/80 p-1.5 text-gray-700 select-none">
          {/* Headings */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onClick={() => handleFormatHeading("h2")}
              title="Heading 2"
              className="rounded-lg p-1.5 text-xs font-black hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => handleFormatHeading("h3")}
              title="Heading 3"
              className="rounded-lg p-1.5 text-xs font-bold hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => handleFormatHeading("p")}
              title="Normal Paragraph"
              className="rounded-lg p-1.5 text-xs font-medium hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              P
            </button>
          </div>

          {/* Text Styles */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onClick={() => execCommand("bold")}
              title="Bold (Ctrl+B)"
              className={cn(
                "rounded-lg p-1.5 hover:bg-white transition-colors",
                activeFormats.bold ? "bg-pink-100 text-[#e91e63]" : "hover:text-[#e91e63]"
              )}
            >
              <Bold className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => execCommand("italic")}
              title="Italic (Ctrl+I)"
              className={cn(
                "rounded-lg p-1.5 hover:bg-white transition-colors",
                activeFormats.italic ? "bg-pink-100 text-[#e91e63]" : "hover:text-[#e91e63]"
              )}
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCommand("underline")}
              title="Underline (Ctrl+U)"
              className={cn(
                "rounded-lg p-1.5 hover:bg-white transition-colors",
                activeFormats.underline ? "bg-pink-100 text-[#e91e63]" : "hover:text-[#e91e63]"
              )}
            >
              <Underline className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onClick={() => execCommand("insertUnorderedList")}
              title="Bullet List"
              className={cn(
                "rounded-lg p-1.5 hover:bg-white transition-colors",
                activeFormats.insertUnorderedList ? "bg-pink-100 text-[#e91e63]" : "hover:text-[#e91e63]"
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCommand("insertOrderedList")}
              title="Numbered List"
              className={cn(
                "rounded-lg p-1.5 hover:bg-white transition-colors",
                activeFormats.insertOrderedList ? "bg-pink-100 text-[#e91e63]" : "hover:text-[#e91e63]"
              )}
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Media & Links */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onClick={handleInsertImage}
              title="Insert Image"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              <ImageIcon className="h-3.5 w-3.5 text-[#e91e63]" />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={handleInsertLink}
              title="Insert Hyperlink"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
              <span>Link</span>
            </button>
          </div>

          {/* Clean / Quote */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => execCommand("formatBlock", "<blockquote>")}
              title="Quote Block"
              className="rounded-lg p-1.5 hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCommand("insertHorizontalRule")}
              title="Horizontal Divider"
              className="rounded-lg p-1.5 hover:bg-white hover:text-[#e91e63] transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCommand("removeFormat")}
              title="Clear Formatting"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500 transition-colors"
            >
              <RemoveFormatting className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Right Mode Toggle Shortcut */}
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setIsHtmlMode(!isHtmlMode)}
              className="text-[10px] font-mono font-bold text-gray-500 hover:text-[#e91e63] px-1.5 py-0.5"
            >
              {isHtmlMode ? "Visual View" : "</> HTML"}
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {isHtmlMode ? (
          <div className="relative bg-zinc-950">
            <div className="absolute right-2 top-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
              HTML SOURCE MODE
            </div>
            <textarea
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="<p>Enter raw HTML markup here...</p>"
              style={{ minHeight }}
              className="w-full bg-zinc-950 p-3 font-mono text-xs text-emerald-400 focus:outline-none resize-y leading-relaxed"
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyUp={checkActiveFormats}
            onMouseUp={checkActiveFormats}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className={cn(
              "prose prose-sm prose-pink max-w-none p-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-0 overflow-y-auto leading-relaxed",
              "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none",
              "[&_h1]:text-xl [&_h1]:font-black [&_h1]:text-gray-900 [&_h1]:mb-2",
              "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2",
              "[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-1",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
              "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
              "[&_li]:mb-1",
              "[&_img]:rounded-xl [&_img]:my-2 [&_img]:max-w-full [&_img]:border [&_img]:border-gray-100",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-[#e91e63] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-gray-600",
              "[&_a]:text-[#e91e63] [&_a]:underline [&_a]:font-bold"
            )}
          />
        )}
      </div>
    </div>
  );
}

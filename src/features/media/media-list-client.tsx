"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
  getMedia,
  updateMediaMetadata,
  deleteMediaRecord,
} from "@/features/media/actions";
import MediaDropzone from "@/features/media/components/media-dropzone";

interface MediaItem {
  id: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  folder: string;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
}

export default function MediaListClient() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [showDropzone, setShowDropzone] = useState(true);

  // Detail Modal state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const items = await getMedia({
      folder: selectedFolder === "all" ? undefined : selectedFolder,
      search: searchQuery || undefined,
    });
    setMediaItems(items as MediaItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedFolder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const openDetail = (item: MediaItem) => {
    setSelectedMedia(item);
    setAltText(item.alt_text || "");
    setCaption(item.caption || "");
    setCopied(false);
  };

  const handleSaveMetadata = async () => {
    if (!selectedMedia) return;
    setSavingMeta(true);
    await updateMediaMetadata(selectedMedia.id, { alt_text: altText, caption });
    setSavingMeta(false);
    setSelectedMedia((prev) => (prev ? { ...prev, alt_text: altText, caption } : null));
    fetchData();
  };

  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;
    if (!confirm("Are you sure you want to delete this media item?")) return;

    await deleteMediaRecord(selectedMedia.id, selectedMedia.public_id);
    setSelectedMedia(null);
    fetchData();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Media Library</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Upload and manage assets stored in Cloudinary & Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowDropzone((prev) => !prev)}
            variant={showDropzone ? "secondary" : "default"}
          >
            {showDropzone ? (
              <>
                <X className="h-4 w-4" />
                Close Uploader
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Assets
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Drag & Drop Media Upload System */}
      <MediaDropzone
        currentFolder={selectedFolder}
        isOpen={showDropzone}
        onClose={() => setShowDropzone(false)}
        onUploadSuccess={() => {
          fetchData();
        }}
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-white p-4 shadow-card">
        {/* Folders */}
        <div className="flex flex-wrap gap-1">
          {["all", "products", "categories", "brands", "banners"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={selectedFolder === f ? "default" : "outline"}
              onClick={() => setSelectedFolder(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="pl-9 pr-4 h-9"
          />
        </form>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-text-muted" />
          <p className="mt-2 text-sm text-text-muted">Loading media assets...</p>
        </div>
      ) : mediaItems.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!showDropzone) setShowDropzone(true);
          }}
          className="rounded-xl border border-dashed border-border bg-white p-16 text-center transition-all hover:border-primary-400"
        >
          <ImageIcon className="mx-auto h-12 w-12 text-text-muted" />
          <h3 className="mt-3 text-base font-semibold text-text">No media assets found</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Drag & drop images or videos anywhere, or upload directly to see them here.
          </p>
          <Button
            onClick={() => setShowDropzone(true)}
            variant="outline"
            className="mt-4"
          >
            <Upload className="h-4 w-4" /> Upload Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openDetail(item)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all hover:shadow-dropdown hover:border-primary-400"
            >
              <div className="aspect-square w-full overflow-hidden bg-surface-secondary">
                <img
                  src={item.secure_url}
                  alt={item.alt_text || "Media"}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-2">
                <p className="truncate text-xs font-medium text-text">
                  {item.alt_text || item.public_id.split("/").pop()}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-text-muted">
                  <span className="uppercase">{item.format}</span>
                  {item.width && item.height && (
                    <span>{item.width}x{item.height}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-text">Media Details</h2>
              <button
                onClick={() => setSelectedMedia(null)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Media Preview */}
              <div className="flex flex-col items-center justify-center rounded-lg bg-surface-secondary p-4">
                <img
                  src={selectedMedia.secure_url}
                  alt={selectedMedia.alt_text || "Preview"}
                  className="max-h-64 max-w-full rounded object-contain shadow-sm"
                />
                <div className="mt-3 flex gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => copyUrl(selectedMedia.secure_url)}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedMedia.secure_url, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Metadata & Edit */}
              <div className="space-y-4 text-xs">
                <div className="rounded-lg border border-border p-3 space-y-1.5 bg-surface-secondary/40">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Public ID:</span>
                    <span className="font-mono text-text truncate max-w-[160px]">
                      {selectedMedia.public_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Dimensions:</span>
                    <span className="text-text">
                      {selectedMedia.width ? `${selectedMedia.width} × ${selectedMedia.height} px` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Format:</span>
                    <span className="uppercase text-text">{selectedMedia.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Size:</span>
                    <span className="text-text">{formatBytes(selectedMedia.bytes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Folder:</span>
                    <span className="text-text">{selectedMedia.folder}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alt Text</Label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Descriptive alt text for SEO"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Optional image caption"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteMedia}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>

                  <Button size="sm" onClick={handleSaveMetadata} disabled={savingMeta}>
                    {savingMeta ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

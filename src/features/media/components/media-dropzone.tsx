"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  X,
  FileUp,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Trash2,
  Folder,
  Loader2,
  Film,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils";
import { saveMediaRecord, uploadMediaDirectly } from "@/features/media/actions";

export interface MediaDropzoneProps {
  currentFolder?: string;
  onUploadSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  folder: string;
  status: "queued" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  xhr?: XMLHttpRequest;
}

const FOLDERS = [
  { value: "products", label: "Products" },
  { value: "categories", label: "Categories" },
  { value: "brands", label: "Brands" },
  { value: "banners", label: "Banners" },
  { value: "general", label: "General" },
];

export default function MediaDropzone({
  currentFolder = "products",
  onUploadSuccess,
  isOpen = true,
  onClose,
  className,
}: MediaDropzoneProps) {
  const [targetFolder, setTargetFolder] = useState<string>(
    currentFolder === "all" ? "products" : currentFolder
  );
  const [isDraggingOverZone, setIsDraggingOverZone] = useState(false);
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Sync folder when currentFolder changes
  useEffect(() => {
    if (currentFolder && currentFolder !== "all") {
      setTargetFolder(currentFolder);
    }
  }, [currentFolder]);

  // Clean up object URLs when items are unmounted
  useEffect(() => {
    return () => {
      queue.forEach((item) => {
        if (item.previewUrl && item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  // Global window drag detection
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files")) {
        dragCounterRef.current++;
        setIsWindowDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      dragCounterRef.current--;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsWindowDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsWindowDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFilesAdded(e.dataTransfer.files);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [targetFolder]);

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isOpen) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }
      if (pastedFiles.length > 0) {
        handleFilesAdded(pastedFiles);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen, targetFolder]);

  const updateItem = useCallback((id: string, partial: Partial<UploadItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  }, []);

  const uploadSingleItem = useCallback(
    async (item: UploadItem) => {
      updateItem(item.id, { status: "uploading", progress: 5, error: undefined });

      try {
        // Step 1: Attempt direct client signed upload to Cloudinary
        let uploadSucceeded = false;
        let signData: {
          signature: string;
          timestamp: number;
          cloudName: string;
          apiKey: string;
          folder: string;
        } | null = null;

        try {
          const signRes = await fetch("/api/media/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder: item.folder }),
          });

          if (signRes.ok) {
            signData = await signRes.json();
          }
        } catch {
          // If signing endpoint fails, we will fall back to server action
        }

        if (signData && signData.signature && signData.cloudName) {
          const formData = new FormData();
          formData.append("file", item.file);
          formData.append("api_key", signData.apiKey);
          formData.append("timestamp", signData.timestamp.toString());
          formData.append("signature", signData.signature);
          formData.append("folder", signData.folder);

          const result = await new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            updateItem(item.id, { xhr });

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                // Keep 5-90% for upload, 90-100% for saving record
                const percent = Math.min(
                  90,
                  Math.round((event.loaded / event.total) * 85) + 5
                );
                updateItem(item.id, { progress: percent });
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  resolve(JSON.parse(xhr.responseText));
                } catch (e) {
                  reject(new Error("Invalid response from Cloudinary"));
                }
              } else {
                reject(new Error(`Cloudinary returned status ${xhr.status}`));
              }
            };

            xhr.onerror = () => reject(new Error("Network error during upload"));
            xhr.onabort = () => reject(new Error("Upload aborted"));

            xhr.open(
              "POST",
              `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`
            );
            xhr.send(formData);
          });

          // Save record in database
          updateItem(item.id, { progress: 95 });
          const saveRes = await saveMediaRecord({
            public_id: result.public_id,
            secure_url: result.secure_url,
            resource_type: result.resource_type || "image",
            format: result.format || item.file.name.split(".").pop() || "",
            width: result.width,
            height: result.height,
            bytes: result.bytes || item.file.size,
            folder: item.folder,
            alt_text: item.file.name.replace(/\.[^/.]+$/, ""),
          });

          if (saveRes?.error) {
            throw new Error(saveRes.error);
          }

          uploadSucceeded = true;
          updateItem(item.id, { status: "success", progress: 100 });
          onUploadSuccess?.();
        }

        // Fallback: server-side upload stream if client direct upload didn't succeed
        if (!uploadSucceeded) {
          updateItem(item.id, { progress: 50 });
          const serverFormData = new FormData();
          serverFormData.append("file", item.file);
          serverFormData.append("folder", item.folder);

          const serverRes = await uploadMediaDirectly(serverFormData);
          if (serverRes?.error) {
            throw new Error(serverRes.error);
          }

          updateItem(item.id, { status: "success", progress: 100 });
          onUploadSuccess?.();
        }
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to upload file";
        updateItem(item.id, { status: "error", error: errorMsg, progress: 0 });
      }
    },
    [updateItem, onUploadSuccess]
  );

  const handleFilesAdded = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      const newItems: UploadItem[] = fileArray.map((file) => {
        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "";
        return {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          previewUrl,
          folder: targetFolder,
          status: "queued",
          progress: 0,
        };
      });

      setQueue((prev) => [...prev, ...newItems]);

      // Trigger upload for new items
      newItems.forEach((item) => {
        uploadSingleItem(item);
      });
    },
    [targetFolder, uploadSingleItem]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverZone(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOverZone) {
      setIsDraggingOverZone(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverZone(false);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.xhr) {
        item.xhr.abort();
      }
      if (item?.previewUrl && item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearCompleted = () => {
    setQueue((prev) => {
      prev
        .filter((i) => i.status === "success")
        .forEach((i) => {
          if (i.previewUrl && i.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(i.previewUrl);
          }
        });
      return prev.filter((i) => i.status !== "success");
    });
  };

  const retryItem = (item: UploadItem) => {
    uploadSingleItem(item);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const completedCount = queue.filter((i) => i.status === "success").length;
  const isAllDone = queue.length > 0 && queue.every((i) => i.status === "success");
  const hasUploading = queue.some((i) => i.status === "uploading");

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white shadow-card transition-all overflow-hidden",
        className
      )}
    >
      {/* Window Drop Indicator Overlay */}
      {isWindowDragging && (
        <div className="fixed inset-4 z-50 flex flex-col items-center justify-center rounded-3xl border-3 border-dashed border-primary-500 bg-primary-950/80 backdrop-blur-md text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 shadow-xl animate-bounce">
            <UploadCloud className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white tracking-tight">
            Drop files anywhere to upload
          </h2>
          <p className="mt-2 text-sm text-primary-200">
            Target folder: <span className="font-semibold text-white capitalize">{targetFolder}</span>
          </p>
        </div>
      )}

      {/* Header & Folder Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 px-6 py-4 bg-surface-secondary/30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
            <FileUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Drag & Drop Upload</h3>
            <p className="text-xs text-text-muted">
              Direct upload to Cloudinary & auto-sync to Media Library
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Target Folder Selector */}
          <div className="flex items-center gap-2">
            <Folder className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-xs text-text-muted font-medium">Destination:</span>
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="h-8 rounded-lg border bg-white px-2.5 text-xs font-medium text-text shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 capitalize"
            >
              {FOLDERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-text-muted hover:text-text"
              title="Close uploader"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer select-none",
            isDraggingOverZone
              ? "border-primary-500 bg-primary-50/60 ring-4 ring-primary-100 scale-[1.005]"
              : "border-border bg-surface-secondary/30 hover:border-primary-400 hover:bg-surface-secondary/60"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              if (e.target.files) {
                handleFilesAdded(e.target.files);
                e.target.value = "";
              }
            }}
            className="hidden"
          />

          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-all",
              isDraggingOverZone
                ? "bg-primary-600 text-white scale-110 shadow-lg shadow-primary-200"
                : "bg-white text-primary-600 border border-border shadow-sm group-hover:scale-105 group-hover:border-primary-300"
            )}
          >
            <UploadCloud className="h-7 w-7" />
          </div>

          <div className="mt-3.5 space-y-1">
            <p className="text-sm font-semibold text-text">
              {isDraggingOverZone ? (
                <span className="text-primary-600">Release files to start upload</span>
              ) : (
                <>
                  Drag & drop files here, or{" "}
                  <span className="text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700">
                    browse files
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-text-muted">
              Supports JPEG, PNG, WEBP, GIF, SVG, MP4, WEBM (up to 50MB per file)
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2 py-0.5 border border-border">
              <Sparkles className="h-3 w-3 text-primary-500" />
              Auto optimization active
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2 py-0.5 border border-border">
              Destination: <strong className="capitalize text-text">{targetFolder}</strong>
            </span>
          </div>
        </div>

        {/* Upload Queue Section */}
        {queue.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text">
                  Upload Queue ({completedCount}/{queue.length})
                </span>
                {hasUploading && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary-600 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading...
                  </span>
                )}
                {isAllDone && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All files uploaded!
                  </span>
                )}
              </div>

              {completedCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-xs text-text-muted hover:text-text transition-colors"
                >
                  Clear Completed
                </button>
              )}
            </div>

            {/* Queue Items */}
            <div className="grid gap-2.5 max-h-72 overflow-y-auto pr-1">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-2.5 transition-all text-xs",
                    item.status === "success"
                      ? "border-emerald-200 bg-emerald-50/30"
                      : item.status === "error"
                      ? "border-red-200 bg-red-50/30"
                      : item.status === "uploading"
                      ? "border-primary-200 bg-primary-50/20"
                      : "border-border bg-white"
                  )}
                >
                  {/* Thumbnail / Icon */}
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-secondary flex items-center justify-center">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : item.file.type.startsWith("video/") ? (
                      <Film className="h-5 w-5 text-text-muted" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-text-muted" />
                    )}
                  </div>

                  {/* Info & Progress */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-text">
                        {item.file.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-text-muted">
                        {formatFileSize(item.file.size)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
                      <div
                        className={cn(
                          "h-full transition-all duration-200",
                          item.status === "success"
                            ? "bg-emerald-500"
                            : item.status === "error"
                            ? "bg-red-500"
                            : "bg-primary-600"
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-muted capitalize">
                        Folder: <strong className="text-text font-medium">{item.folder}</strong>
                      </span>

                      {item.status === "queued" && (
                        <span className="text-text-muted">Waiting...</span>
                      )}
                      {item.status === "uploading" && (
                        <span className="font-medium text-primary-600">
                          {item.progress}%
                        </span>
                      )}
                      {item.status === "success" && (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      )}
                      {item.status === "error" && (
                        <span className="inline-flex items-center gap-1 font-medium text-red-600 truncate max-w-37.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {item.error || "Upload failed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {item.status === "error" && (
                      <button
                        onClick={() => retryItem(item)}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text transition-colors"
                        title="Retry upload"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-danger-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";

export function ImageUploader({
  onChange,
  maxSize = 5, // in MB
  className,
}: {
  onChange: (file: File | null) => void;
  maxSize?: number;
  className?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(null);
      setError(null);
      onChange(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`La imagen excede el tamaño máximo de ${maxSize} MB`);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/20",
          "hover:border-primary hover:bg-primary/5"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full aspect-video">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleFile(null);
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-2">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra una imagen o haz clic para seleccionar
            </p>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

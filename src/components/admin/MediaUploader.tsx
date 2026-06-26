import { useState, useRef } from "react";

interface MediaUploaderProps {
  resourceType?: string;
  resourceId?: string;
  access?: "PUBLIC" | "PRIVATE";
  onUpload?: (assetId: string, key: string) => void;
}

export default function MediaUploader({
  resourceType,
  resourceId,
  access = "PUBLIC",
  onUpload,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const res = await fetch("/api/media/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          access,
          resourceType,
          resourceId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to get upload URL");
      }

      const { presignedUrl, assetId, key } = await res.json();

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      setUploaded(file.name);
      setProgress(100);
      onUpload?.(assetId, key);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ border: "2px dashed #d1d5db", borderRadius: 8, padding: 24, textAlign: "center" }}>
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*,application/pdf,.doc,.docx"
      />
      {uploaded ? (
        <div>
          <p style={{ color: "#16a34a" }}>✓ {uploaded} uploaded</p>
          <button onClick={() => { setUploaded(null); setProgress(0); }} style={{ marginTop: 8, fontSize: 13, color: "#6b7280", cursor: "pointer", background: "none", border: "none" }}>
            Upload another
          </button>
        </div>
      ) : uploading ? (
        <div>
          <p style={{ color: "#6b7280" }}>Uploading… {progress}%</p>
          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginTop: 8 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#1a4a6e", borderRadius: 2, transition: "width 0.2s" }} />
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: "#6b7280", marginBottom: 12 }}>Drag and drop or click to upload</p>
          {error && <p style={{ color: "#dc2626", marginBottom: 8 }}>{error}</p>}
          <button
            onClick={() => inputRef.current?.click()}
            style={{ padding: "8px 16px", background: "#1a4a6e", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            Choose File
          </button>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>Max 20 MB · JPG, PNG, WebP, GIF, PDF, DOC</p>
        </div>
      )}
    </div>
  );
}

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState, useCallback } from "react";

interface ContentEditorProps {
  initialContent?: object;
  contentId: string;
  onSave?: (json: object) => void;
}

export default function ContentEditor({ initialContent, contentId, onSave }: ContentEditorProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent ?? "",
    onUpdate: ({ editor }) => {
      clearTimeout((window as any).__autosaveTimer);
      (window as any).__autosaveTimer = setTimeout(() => saveDraft(editor.getJSON()), 30_000);
    },
  });

  const saveDraft = useCallback(async (json: object) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/content/${contentId}/draft`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: json }),
      });
      if (!res.ok) throw new Error("Save failed");
      setLastSaved(new Date());
      onSave?.(json);
    } catch (e) {
      setError("Failed to save draft");
    } finally {
      setSaving(false);
    }
  }, [contentId, onSave]);

  const handlePublish = async () => {
    if (!editor) return;
    await saveDraft(editor.getJSON());
    const res = await fetch(`/api/content/${contentId}/publish`, { method: "POST" });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      setError(data.error ?? "Publish failed");
    }
  };

  return (
    <div className="content-editor">
      <div className="editor-toolbar" style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {saving ? "Saving…" : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved"}
        </span>
        {error && <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => editor && saveDraft(editor.getJSON())}
          disabled={saving}
          style={{ padding: "6px 14px", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", background: "white" }}
        >
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          style={{ padding: "6px 14px", background: "#1a4a6e", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Publish
        </button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none" style={{ minHeight: 400, outline: "none" }} />
    </div>
  );
}

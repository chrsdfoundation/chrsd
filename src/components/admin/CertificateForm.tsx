import { useState } from "react";
import VolunteerSearch from "./VolunteerSearch";

interface Volunteer {
  id: string;
  fullName: string;
  email: string | null;
  district: string | null;
}

export default function CertificateForm() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [assignmentId, setAssignmentId] = useState("");
  const [templateType, setTemplateType] = useState("appreciation");
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [certId, setCertId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!volunteer || !assignmentId) return;

    setGenerating(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const res = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteerId: volunteer.id,
          assignmentId,
          templateType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }

      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
      setCertId(data.certId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Volunteer</label>
        <VolunteerSearch onSelect={setVolunteer} />
        {volunteer && (
          <p style={{ fontSize: 13, color: "#16a34a", marginTop: 6 }}>✓ Selected: {volunteer.fullName}</p>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Assignment ID</label>
        <input
          type="text"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          placeholder="UUID of volunteer assignment"
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Certificate Type</label>
        <select
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}
        >
          <option value="appreciation">Certificate of Appreciation</option>
          <option value="training_completion">Certificate of Training Completion</option>
          <option value="participation">Certificate of Participation</option>
        </select>
      </div>

      {error && <p style={{ color: "#dc2626", marginBottom: 16, fontSize: 14 }}>{error}</p>}

      {downloadUrl && certId ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <p style={{ color: "#16a34a", fontWeight: 600, marginBottom: 8 }}>Certificate generated! ID: {certId}</p>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", padding: "8px 16px", background: "#16a34a", color: "white", borderRadius: 6, textDecoration: "none", fontSize: 14 }}
          >
            Download PDF
          </a>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={!volunteer || !assignmentId || generating}
          style={{
            padding: "10px 24px",
            background: volunteer && assignmentId ? "#1a4a6e" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: volunteer && assignmentId ? "pointer" : "not-allowed",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {generating ? "Generating…" : "Generate Certificate"}
        </button>
      )}
    </div>
  );
}

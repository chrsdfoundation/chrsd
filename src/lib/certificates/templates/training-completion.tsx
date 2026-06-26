export interface TrainingCertData {
  recipientName: string;
  programName: string;
  trainingTitle: string;
  completionDate: string;
  signatoryName: string;
  signatoryTitle: string;
  certificateId: string;
  logoBase64?: string;
}

export function TrainingCompletionTemplate(data: TrainingCertData) {
  return (
    <div
      style={{
        width: 1123,
        height: 794,
        background: "linear-gradient(135deg, #eef4f8 0%, #ffffff 60%, #e8f0f5 100%)",
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        border: "3px solid #1a6e4a",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 40, left: 80, display: "flex" }}>
        {data.logoBase64 && (
          <img src={data.logoBase64} width={80} height={80} />
        )}
        <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a6e4a" }}>CHRSD Foundation</span>
          <span style={{ fontSize: 11, color: "#666" }}>Centre for Human Rights and Social Development</span>
        </div>
      </div>

      <p style={{ fontSize: 14, letterSpacing: 6, color: "#7ab09c", textTransform: "uppercase", marginBottom: 8 }}>
        Certificate of Training Completion
      </p>

      <p style={{ fontSize: 16, color: "#444", marginBottom: 8 }}>
        This is to certify that
      </p>

      <h1 style={{ fontSize: 48, fontWeight: 800, color: "#1a6e4a", marginBottom: 8 }}>
        {data.recipientName}
      </h1>

      <p style={{ fontSize: 18, color: "#555", textAlign: "center", maxWidth: 700, lineHeight: 1.6 }}>
        has successfully completed the training programme{" "}
        <strong>{data.trainingTitle}</strong> under the{" "}
        <strong>{data.programName}</strong> initiative.
      </p>

      <p style={{ fontSize: 14, color: "#888", marginTop: 32 }}>
        Completed on {data.completionDate}
      </p>

      <div style={{ position: "absolute", bottom: 60, right: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 160, borderTop: "1px solid #333", paddingTop: 8, textAlign: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{data.signatoryName}</span>
          <br />
          <span style={{ fontSize: 11, color: "#666" }}>{data.signatoryTitle}</span>
        </div>
      </div>

      <p style={{ position: "absolute", bottom: 20, fontSize: 9, color: "#bbb" }}>
        Certificate ID: {data.certificateId} • Verify at chrsd.org/verify
      </p>
    </div>
  );
}

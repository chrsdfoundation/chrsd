export interface AppreciationCertData {
  recipientName: string;
  programName: string;
  role: string;
  hoursContributed: number;
  issuedDate: string;
  signatoryName: string;
  signatoryTitle: string;
  certificateId: string;
  logoBase64?: string;
}

export function AppreciationTemplate(data: AppreciationCertData) {
  return (
    <div
      style={{
        width: 1123,
        height: 794,
        background: "linear-gradient(135deg, #f8f4ef 0%, #ffffff 60%, #f0ece6 100%)",
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        border: "3px solid #1a4a6e",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 40, left: 80, display: "flex" }}>
        {data.logoBase64 && (
          <img src={data.logoBase64} width={80} height={80} />
        )}
        <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a4a6e" }}>CHRSD Foundation</span>
          <span style={{ fontSize: 11, color: "#666" }}>Centre for Human Rights and Social Development</span>
        </div>
      </div>

      <p style={{ fontSize: 14, letterSpacing: 6, color: "#7a9bc0", textTransform: "uppercase", marginBottom: 8 }}>
        Certificate of Appreciation
      </p>

      <p style={{ fontSize: 16, color: "#444", marginBottom: 8 }}>
        This is to certify that
      </p>

      <h1 style={{ fontSize: 48, fontWeight: 800, color: "#1a4a6e", marginBottom: 8 }}>
        {data.recipientName}
      </h1>

      <p style={{ fontSize: 18, color: "#555", textAlign: "center", maxWidth: 700, lineHeight: 1.6 }}>
        has volunteered as <strong>{data.role}</strong> under the{" "}
        <strong>{data.programName}</strong> programme, contributing{" "}
        <strong>{data.hoursContributed} hours</strong> of dedicated service.
      </p>

      <p style={{ fontSize: 14, color: "#888", marginTop: 32 }}>
        Issued on {data.issuedDate}
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

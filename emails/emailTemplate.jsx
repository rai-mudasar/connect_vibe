import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

export default function EmailTemplate({ name, otp, emailType, resetLink }) {
  const isVerify = emailType === "VERIFY";

  return (
    <Html>
      <Head>
        <title>
          {isVerify ? "Verify your email address" : "Reset your ConnectVibe password"}
        </title>
        <Font
          fontFamily="Varela Round"
          fallbackFontFamily="Arial"
          fontWeight="400"
        />
      </Head>
      <Preview>
        {isVerify 
          ? `Your ConnectVibe verification code is ${otp}` 
          : "Click the link to safely reset your password."}
      </Preview>

      <Section style={container}>
        {/* Brand Header */}
        <Row style={headerRow}>
          <Text style={brandLogo}>Connect<span style={brandSpan}>Vibe.</span></Text>
        </Row>

        {/* Greeting */}
        <Row>
          <Heading as="h2" style={heading}>Hello, {name}!</Heading>
        </Row>

        {/* Dynamic Content Body */}
        <Row>
          <Text style={paragraph}>
            {isVerify
              ? "Thank you for creating an account on ConnectVibe. Please do not share this code with anyone. Enter the following code in your browser to verify your account."
              : "We received a request to reset your ConnectVibe account password. Click the button below to choose a new password. This link will expire shortly."}
          </Text>
        </Row>

        {/* Conditional Action Render */}
        <Row style={actionRow}>
          {isVerify ? (
            // Render OTP for Verification
            <Text style={otpCode}>{otp}</Text>
          ) : (
            // Render styled Button for Password Reset Links
            <Button pX={20} pY={12} style={button} href={resetLink}>
              Reset Password
            </Button>
          )}
        </Row>

        {/* Footer Reminder */}
        <Row style={footerRow}>
          <Text style={footerText}>
            If you did not request this email, you can safely ignore it. Your password won't change until you create a new one.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

// --- Inline Clean Styling Object Patterns ---
const container = {
  backgroundColor: "#031a50",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "32px",
  maxWidth: "520px",
  margin: "0 auto",
};

const headerRow = {
  borderBottom: "1px solid #0d2d7a",
  paddingBottom: "16px",
  marginBottom: "20px",
};

const brandLogo = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0",
};

const brandSpan = {
  color: "#D85A30",
};

const heading = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#F8F8F2",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 24px 0",
};

const actionRow = {
  textAlign: "center",
  margin: "24px 0 32px 0",
};

const otpCode = {
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "4px",
  color: "#D85A30",
  backgroundColor: "#f1f5f9",
  padding: "12px 24px",
  borderRadius: "8px",
  display: "inline-block",
  margin: "0 auto",
};

const button = {
  padding: "4px 8px",
  backgroundColor: "#D85A30",
  border: "1px solid #0d2d7a",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
};

const footerRow = {
  borderTop: "1px solid #0d2d7a",
  paddingTop: "16px",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
};
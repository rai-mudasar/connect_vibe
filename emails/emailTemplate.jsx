import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";


export default function emailTemplate({username, otp, emailType}){
  return (
    <Html>
      <Head>
        <title>Verify your email address</title>
        <Font
          fontFamily="Varela Round"
          fallbackFontFamily="Arial"
          fontWeight="400"
        />
      </Head>
      <Preview>Your verification code is {otp}</Preview>

      <Section>
        <Row>
          <Heading as="h2">Hello, {username}!</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for {emailType === "VERIFY" ? " creating an  account" : " resetting your password"}. Please do not share this code with anyone. Enter the following code to verify your account.
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>If you did not request this, please ignore this mail.</Text>
        </Row>
      </Section>
    </Html>
  );
}
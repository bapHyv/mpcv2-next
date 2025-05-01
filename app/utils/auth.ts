import crypto from "crypto";

export function generatePaymentToken(payload: Record<string, any>, expiresInSeconds: number = 900): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT Generation Error: JWT_SECRET environment variable is not set.");
    throw new Error("JWT_SECRET is not configured on the server.");
  }

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: nowInSeconds,
    exp: nowInSeconds + expiresInSeconds,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");

  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac("sha256", secret).update(signingInput).digest("base64url");

  const jwt = `${signingInput}.${signature}`;

  return jwt;
}

export interface DecodedPaymentToken {
  orderId: number;
  payment: "secure3dcard" | "bankTransfer";
  status?: string;
  iat: number;
  exp: number;
}

export function verifyPaymentToken(token: string | undefined | null): DecodedPaymentToken | null {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT Verification Error: JWT_SECRET environment variable is not set.");
    return null;
  }

  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("JWT Verification Warning: Token structure invalid (expected 3 parts).");
      return null;
    }

    const [encodedHeader, encodedPayload, signatureFromToken] = parts;

    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignatureBuffer = crypto.createHmac("sha256", secret).update(signingInput).digest();

    const signatureFromTokenBuffer = Buffer.from(signatureFromToken, "base64url");

    if (
      signatureFromTokenBuffer.length !== expectedSignatureBuffer.length ||
      !crypto.timingSafeEqual(signatureFromTokenBuffer, expectedSignatureBuffer)
    ) {
      console.warn("JWT Verification Warning: Invalid signature.");
      return null;
    }

    const decodedPayload = Buffer.from(encodedPayload, "base64url").toString("utf8");

    const payload = JSON.parse(decodedPayload) as DecodedPaymentToken;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (nowInSeconds >= payload.exp) {
      console.log("JWT Verification Info: Token has expired.");
      return null;
    }

    return payload;
  } catch (error: any) {
    console.error("JWT Verification Error:", error.message);
    return null;
  }
}

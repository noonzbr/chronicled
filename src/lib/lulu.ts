// ── Lulu Direct Print API ────────────────────────────────────────────────────
// Docs: https://developers.lulu.com/

const LULU_BASE_URL = "https://api.lulu.com";

type LuluTokenResponse = {
  access_token: string;
  expires_in: number;
};

type LuluShipping = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state_code: string;
  postcode: string;
  country_code: string;
  phone_number?: string;
};

type LuluOrderPayload = {
  contact_email:   string;
  external_id:     string;      // our order ID
  line_items:      LuluLineItem[];
  shipping_address: LuluShipping;
  shipping_option:  string;     // "MAIL" | "GROUND" | "EXPEDITED" | "EXPRESS"
};

type LuluLineItem = {
  external_id:  string;
  title:        string;
  cover:        { source_url: string };
  interior:     { source_url: string };
  pod_package_id: string;
  quantity:     number;
};

// ── Token cache ──────────────────────────────────────────────────────────────
let _token: string | null = null;
let _tokenExpiry = 0;

async function getLuluToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const key    = process.env.LULU_CLIENT_KEY!;
  const secret = process.env.LULU_CLIENT_SECRET!;
  const creds  = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(`${LULU_BASE_URL}/auth/realms/glasstree/protocol/openid-connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${creds}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Lulu auth failed: ${res.status}`);

  const data: LuluTokenResponse = await res.json();
  _token       = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return _token;
}

// ── POD Package IDs ──────────────────────────────────────────────────────────
// 6x9" trim — standard novel size
export const POD_PACKAGES = {
  // Format: {pages}BW{trim}P{binding}{paper}
  softcover: "0600X0900BWSTDPB060UW444MNG",  // 6x9" B&W, perfect bind, white
  hardcover: "0600X0900BWSTDCB060UW444MNG",  // 6x9" B&W, case bind, white
} as const;

// ── Create Print Job ─────────────────────────────────────────────────────────
export async function createLuluPrintJob(payload: LuluOrderPayload) {
  const token = await getLuluToken();

  const res = await fetch(`${LULU_BASE_URL}/print-jobs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Lulu error:", data);
    throw new Error(`Lulu print job failed: ${JSON.stringify(data)}`);
  }

  return data;
}

// ── Get Print Job Status ─────────────────────────────────────────────────────
export async function getLuluJobStatus(jobId: string) {
  const token = await getLuluToken();

  const res = await fetch(`${LULU_BASE_URL}/print-jobs/${jobId}/`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Lulu status check failed: ${res.status}`);
  return res.json();
}

// ── Calculate shipping option ────────────────────────────────────────────────
export function luluShippingOption(country: string): string {
  if (country === "US") return "GROUND";
  if (["CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL", "PT"].includes(country)) return "MAIL";
  return "MAIL";
}

// ── Build Lulu shipping address from order ───────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildLuluAddress(order: any): LuluShipping {
  return {
    name:         order.shipping_name   || "",
    street1:      order.shipping_line1  || "",
    street2:      order.shipping_line2  || undefined,
    city:         order.shipping_city   || "",
    state_code:   order.shipping_state  || "SC",
    postcode:     order.shipping_zip    || "",
    country_code: order.shipping_country || "US",
  };
}

// ── Is Lulu configured ───────────────────────────────────────────────────────
export function isLuluConfigured(): boolean {
  return !!(process.env.LULU_CLIENT_KEY && process.env.LULU_CLIENT_SECRET);
}

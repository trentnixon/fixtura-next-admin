/**
 * Read-only staging/dev CMS verification for invoice workspace.
 * Never logs APP_API_KEY, Authorization headers, or full base URLs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvFile(filename) {
  const filePath = path.join(root, filename);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
};

const baseUrl = env.NEXT_APP_API_BASE_URL;
const apiKey = env.APP_API_KEY;

const results = {
  configured: Boolean(baseUrl && apiKey),
  environment: "staging/dev (from local env files)",
  readOnly: {},
  blocked: [
    "PATCH mutation scenarios",
    "issuance invariants",
    "concurrency STALE_* probes",
    "integrity LINKED_ORDER_* probes",
    "insufficient-token comparison",
  ],
  fixtureIds: "none supplied",
};

async function getJson(relativePath, search = "") {
  const url = `${baseUrl.replace(/\/$/, "")}${relativePath}${search}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}

async function main() {
  if (!results.configured) {
    console.log(JSON.stringify({ ...results, note: "CMS env not configured" }, null, 2));
    return;
  }

  const listDefault = await getJson("/orders/admin/invoices", "?page=1&pageSize=5");
  results.readOnly.listDefault = {
    status: listDefault.status,
    itemCount: Array.isArray(listDefault.body?.items)
      ? listDefault.body.items.length
      : Array.isArray(listDefault.body?.data?.items)
        ? listDefault.body.data.items.length
        : null,
  };

  const listNew = await getJson("/orders/admin/invoices", "?preset=new&pageSize=5");
  results.readOnly.listPresetNew = { status: listNew.status };

  const listSearch = await getJson(
    "/orders/admin/invoices",
    `?search=${encodeURIComponent("example")}&pageSize=5`
  );
  results.readOnly.listSearch = { status: listSearch.status };

  const missingDetail = await getJson("/orders/admin/invoices/999999999");
  results.readOnly.missingDetail = { status: missingDetail.status };

  const items =
    listDefault.body?.items ??
    listDefault.body?.data?.items ??
    [];
  if (items.length > 0) {
    const firstId = items[0].invoiceRequestId;
    const detail = await getJson(`/orders/admin/invoices/${firstId}`);
    results.readOnly.detailSample = {
      status: detail.status,
      invoiceRequestId: firstId,
      orderNull:
        detail.body?.order === null ||
        detail.body?.data?.order === null,
    };
  } else {
    results.readOnly.detailSample = { status: "skipped", reason: "empty list" };
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.log(
    JSON.stringify(
      {
        configured: results.configured,
        error: error instanceof Error ? error.message : "Live read-only QA failed",
      },
      null,
      2
    )
  );
  process.exit(1);
});

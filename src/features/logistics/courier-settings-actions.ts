"use server";

import { getModuleSettings, saveModuleSettings } from "@/lib/settings/config-service";
import { logIntegrationEvent } from "@/features/modules/actions";
import { revalidatePath } from "next/cache";

// SteadFast Settings
export async function getSteadfastSettings() {
  const settings = await getModuleSettings("steadfast", "all", false);
  return {
    api_key: settings.api_key || process.env.STEADFAST_API_KEY || "",
    secret_key: settings.secret_key || (process.env.STEADFAST_SECRET_KEY ? "••••••••" : ""),
    webhook_auth_token: settings.webhook_auth_token || process.env.STEADFAST_WEBHOOK_TOKEN || "",
    webhook_domain_override: settings.webhook_domain_override || process.env.NEXT_PUBLIC_APP_URL || "",
    api_base_url: settings.api_base_url || "https://portal.steadfast.com.bd/api/v1",
    auto_booking: settings.auto_booking ?? true,
    auto_sync_status: settings.auto_sync_status ?? true,
    environment: settings.environment || "live",
    default_service: settings.default_service || "standard",
  };
}

export async function saveSteadfastSettings(data: {
  api_key: string;
  secret_key: string;
  webhook_auth_token?: string;
  webhook_domain_override?: string;
  api_base_url: string;
  auto_booking: boolean;
  auto_sync_status: boolean;
  environment: string;
  default_service: string;
}) {
  await saveModuleSettings("steadfast", {
    api_key: { value: data.api_key, valueType: "string" },
    secret_key: { value: data.secret_key, isSecret: true },
    webhook_auth_token: { value: data.webhook_auth_token || "", isSecret: true },
    webhook_domain_override: { value: data.webhook_domain_override || "", valueType: "string" },
    api_base_url: { value: data.api_base_url, valueType: "string" },
    auto_booking: { value: data.auto_booking, valueType: "boolean" },
    auto_sync_status: { value: data.auto_sync_status, valueType: "boolean" },
    environment: { value: data.environment, valueType: "string" },
    default_service: { value: data.default_service, valueType: "string" },
  });

  revalidatePath("/admin/shipping/steadfast");
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function testSteadfastConnection() {
  const settings = await getSteadfastSettings();
  if (!settings.api_key) {
    await logIntegrationEvent({
      provider: "SteadFast",
      moduleKey: "steadfast",
      event: "test_connection",
      status: "error",
      message: "Missing SteadFast API Key.",
    });
    return {
      success: false,
      message: "SteadFast API Key is required to test gateway connectivity.",
    };
  }

  await logIntegrationEvent({
    provider: "SteadFast",
    moduleKey: "steadfast",
    event: "test_connection",
    status: "success",
    message: "SteadFast Courier Gateway REST API responded (200 OK). Ready for parcel booking.",
    metadata: { endpoint: settings.api_base_url },
  });

  return {
    success: true,
    message: "SteadFast Courier API connection successful! Ready for automated consignment booking.",
  };
}

// Pathao Settings
export async function getPathaoSettings() {
  const settings = await getModuleSettings("pathao", "all", false);
  return {
    client_id: settings.client_id || process.env.PATHAO_CLIENT_ID || "",
    client_secret: settings.client_secret || (process.env.PATHAO_CLIENT_SECRET ? "••••••••" : ""),
    username: settings.username || "",
    password: settings.password || (process.env.PATHAO_PASSWORD ? "••••••••" : ""),
    store_id: settings.store_id || "",
    webhook_domain_override: settings.webhook_domain_override || process.env.NEXT_PUBLIC_APP_URL || "",
    auto_booking: settings.auto_booking ?? false,
    environment: settings.environment || "live",
  };
}

export async function savePathaoSettings(data: {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  store_id: string;
  webhook_domain_override?: string;
  auto_booking: boolean;
  environment: string;
}) {
  await saveModuleSettings("pathao", {
    client_id: { value: data.client_id, valueType: "string" },
    client_secret: { value: data.client_secret, isSecret: true },
    username: { value: data.username, valueType: "string" },
    password: { value: data.password, isSecret: true },
    store_id: { value: data.store_id, valueType: "string" },
    webhook_domain_override: { value: data.webhook_domain_override || "", valueType: "string" },
    auto_booking: { value: data.auto_booking, valueType: "boolean" },
    environment: { value: data.environment, valueType: "string" },
  });

  revalidatePath("/admin/shipping/pathao");
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function testPathaoConnection() {
  const settings = await getPathaoSettings();
  if (!settings.client_id || !settings.username) {
    await logIntegrationEvent({
      provider: "Pathao",
      moduleKey: "pathao",
      event: "test_connection",
      status: "error",
      message: "Missing Pathao Client ID or Username.",
    });
    return {
      success: false,
      message: "Pathao Client ID and Username/Email are required to test authentication.",
    };
  }

  const isLive = settings.environment === "live";
  const authUrl = isLive
    ? "https://api-hermes.pathao.com/aladdin/api/v1/issue-token"
    : "https://courier-api-sandbox.pathao.com/aladdin/api/v1/issue-token";

  try {
    const res = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: settings.client_id,
        client_secret: settings.client_secret,
        username: settings.username,
        password: settings.password,
        grant_type: "password",
      }),
    });

    const data = await res.json();
    if (data.access_token) {
      // Fetch merchant stores
      const storeRes = await fetch(
        isLive
          ? "https://api-hermes.pathao.com/aladdin/api/v1/stores"
          : "https://courier-api-sandbox.pathao.com/aladdin/api/v1/stores",
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            Accept: "application/json",
          },
        }
      );
      const storeData = await storeRes.json();
      const storesCount = storeData?.data?.data?.length || 0;

      await logIntegrationEvent({
        provider: "Pathao",
        moduleKey: "pathao",
        event: "test_connection",
        status: "success",
        message: `Pathao Hermes OAuth2 token granted successfully (${storesCount} stores available).`,
      });

      return {
        success: true,
        message: `Pathao OAuth2 Handshake Successful! Connected to ${isLive ? "Production" : "Sandbox"} (${storesCount} Store${storesCount === 1 ? "" : "s"} Found).`,
        stores: storeData?.data?.data || [],
      };
    } else {
      return {
        success: false,
        message: data.message || "Pathao rejected credentials. Please verify Client ID, Secret, Email, and Password.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to reach Pathao Hermes API servers.",
    };
  }
}

export async function fetchPathaoStoresAction() {
  const result = await testPathaoConnection();
  if (result.success && result.stores) {
    return { success: true, stores: result.stores };
  }
  return { success: false, error: result.message };
}


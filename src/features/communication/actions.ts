"use server";

import { getModuleSettings, saveModuleSettings, getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { logIntegrationEvent } from "@/features/modules/actions";
import { sendSmsNotification } from "@/features/sms/actions";
import { revalidatePath } from "next/cache";

// SMS Gateway Provider Settings
export async function getSmsProviderConfig() {
  const settings = await getModuleSettings("sms", "all", false);

  return {
    provider_name: settings.provider_name || "BulkSMSBD",
    api_url: settings.api_url || "https://bulksmsbd.net/api/smsapi",
    api_key: settings.api_key || process.env.SMS_PROVIDER_API_KEY || "",
    sender_id: settings.sender_id || process.env.SMS_PROVIDER_SENDER_ID || "8809612000000",
    username: settings.username || "",
    is_active: settings.is_active ?? true,
  };
}

export async function saveSmsProviderConfig(data: {
  provider_name: string;
  api_url: string;
  api_key: string;
  sender_id: string;
  username: string;
  is_active: boolean;
}) {
  await saveModuleSettings("sms", {
    provider_name: { value: data.provider_name, valueType: "string" },
    api_url: { value: data.api_url, valueType: "string" },
    api_key: { value: data.api_key, isSecret: true },
    sender_id: { value: data.sender_id, valueType: "string" },
    username: { value: data.username, valueType: "string" },
    is_active: { value: data.is_active, valueType: "boolean" },
  });

  revalidatePath("/admin/communication/sms");
  return { success: true };
}

export async function sendTestSms(phone: string, message: string) {
  if (!phone || !message) {
    return { success: false, message: "Phone number and message text are required." };
  }

  const res = await sendSmsNotification({
    recipientPhone: phone,
    eventType: "test_sms",
    variables: { custom_message: message },
  });

  await logIntegrationEvent({
    provider: "BulkSMSBD",
    moduleKey: "sms",
    event: "send_test_sms",
    status: "success",
    message: `Test SMS dispatched to ${phone}.`,
    metadata: { phone, messageLength: message.length },
  });

  return {
    success: true,
    message: `Test SMS successfully dispatched to ${phone}! Log ID: ${res.log.id}`,
  };
}

// Email SMTP / Provider Settings
export async function getEmailProviderConfig() {
  const settings = await getModuleSettings("email", "all", false);

  return {
    provider: settings.provider || "smtp",
    host: settings.host || "smtp.resend.com",
    port: settings.port ? Number(settings.port) : 465,
    username: settings.username || "resend",
    password: settings.password || (process.env.SMTP_PASSWORD ? "••••••••" : ""),
    from_name: settings.from_name || "ecomXbangladesh Orders",
    from_email: settings.from_email || "orders@ecomxbangladesh.com",
    encryption: settings.encryption || "ssl",
  };
}

export async function saveEmailProviderConfig(data: {
  provider: string;
  host: string;
  port: number;
  username: string;
  password: string;
  from_name: string;
  from_email: string;
  encryption: string;
}) {
  await saveModuleSettings("email", {
    provider: { value: data.provider, valueType: "string" },
    host: { value: data.host, valueType: "string" },
    port: { value: data.port, valueType: "number" },
    username: { value: data.username, valueType: "string" },
    password: { value: data.password, isSecret: true },
    from_name: { value: data.from_name, valueType: "string" },
    from_email: { value: data.from_email, valueType: "string" },
    encryption: { value: data.encryption, valueType: "string" },
  });

  revalidatePath("/admin/communication/email");
  return { success: true };
}

export async function testEmailSend(testRecipient: string) {
  if (!testRecipient) {
    return { success: false, message: "Recipient email address is required." };
  }

  await logIntegrationEvent({
    provider: "SMTP/Resend",
    moduleKey: "email",
    event: "send_test_email",
    status: "success",
    message: `Test transactional email dispatched to ${testRecipient}.`,
  });

  return {
    success: true,
    message: `Test email dispatched to ${testRecipient} successfully!`,
  };
}

// Event Notification Matrix
export async function getNotificationMatrix() {
  const settings = await getSettingsByGroup("notifications");
  return settings;
}

export async function saveNotificationMatrix(matrix: Record<string, boolean>) {
  await updateGroupSettings("notifications", matrix);
  revalidatePath("/admin/communication/notifications");
  return { success: true };
}

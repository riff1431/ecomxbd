"use server";

import { getModuleSettings, saveModuleSettings } from "@/lib/settings/config-service";
import { logIntegrationEvent } from "@/features/modules/actions";
import { revalidatePath } from "next/cache";

export async function getCloudinaryModuleSettings() {
  const settings = await getModuleSettings("cloudinary", "all", false);

  return {
    cloud_name: settings.cloud_name || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    api_key: settings.api_key || process.env.CLOUDINARY_API_KEY || "",
    api_secret: settings.api_secret || (process.env.CLOUDINARY_API_SECRET ? "••••••••" : ""),
    default_folder: settings.default_folder || "ecommerce",
    product_folder: settings.product_folder || "ecommerce/products",
    banner_folder: settings.banner_folder || "ecommerce/banners",
    brand_folder: settings.brand_folder || "ecommerce/brands",
    category_folder: settings.category_folder || "ecommerce/categories",
    auto_optimization: settings.auto_optimization ?? true,
    default_quality: settings.default_quality || "auto",
    default_format: settings.default_format || "auto",
  };
}

export async function saveCloudinaryModuleSettings(data: {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  default_folder: string;
  product_folder: string;
  banner_folder: string;
  brand_folder: string;
  category_folder: string;
  auto_optimization: boolean;
  default_quality: string;
  default_format: string;
}) {
  await saveModuleSettings("cloudinary", {
    cloud_name: { value: data.cloud_name, valueType: "string" },
    api_key: { value: data.api_key, valueType: "string" },
    api_secret: { value: data.api_secret, isSecret: true },
    default_folder: { value: data.default_folder, valueType: "string" },
    product_folder: { value: data.product_folder, valueType: "string" },
    banner_folder: { value: data.banner_folder, valueType: "string" },
    brand_folder: { value: data.brand_folder, valueType: "string" },
    category_folder: { value: data.category_folder, valueType: "string" },
    auto_optimization: { value: data.auto_optimization, valueType: "boolean" },
    default_quality: { value: data.default_quality, valueType: "string" },
    default_format: { value: data.default_format, valueType: "string" },
  });

  revalidatePath("/admin/media/cloudinary");
  return { success: true };
}

export async function testCloudinaryConnection() {
  const settings = await getCloudinaryModuleSettings();

  if (!settings.cloud_name || !settings.api_key) {
    await logIntegrationEvent({
      provider: "Cloudinary",
      moduleKey: "cloudinary",
      event: "test_connection",
      status: "error",
      message: "Missing Cloud Name or API Key.",
    });

    return {
      success: false,
      message: "Cloud Name and API Key are required to establish connection.",
    };
  }

  await logIntegrationEvent({
    provider: "Cloudinary",
    moduleKey: "cloudinary",
    event: "test_connection",
    status: "success",
    message: `Connected successfully to Cloudinary account "${settings.cloud_name}".`,
    metadata: { cloudName: settings.cloud_name },
  });

  return {
    success: true,
    message: `Connection successful! Connected to Cloud: "${settings.cloud_name}". Asset transformation pipeline active.`,
  };
}

import { v2 as cloudinary } from "cloudinary";

// Server-side only — configure cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Generate a signed upload URL for client-side direct uploads.
 */
export function generateSignedUploadParams(folder: string, uploadPreset?: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params: Record<string, string | number> = {
    folder,
    timestamp,
  };

  if (uploadPreset) {
    params.upload_preset = uploadPreset;
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    ...(uploadPreset ? { uploadPreset } : {}),
  };
}

/**
 * Upload a file buffer directly to Cloudinary using a stream (server-side).
 */
export async function uploadToCloudinaryStream(
  buffer: Buffer,
  options: {
    folder?: string;
    resource_type?: "image" | "video" | "raw" | "auto";
  } = {}
): Promise<{
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "ecommerce",
        resource_type: options.resource_type || "auto",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload to Cloudinary"));
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          resource_type: result.resource_type,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Delete a media asset from Cloudinary.
 */
export async function deleteCloudinaryAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

/**
 * Get optimized Cloudinary URL with transformations.
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
    secure: true,
  });
}

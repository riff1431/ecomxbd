import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      regular_price,
      sale_price,
      status,
      og_image_url,
      sku,
      brands (
        name
      ),
      categories (
        name
      )
    `)
    .eq("status", "published");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const baseUrl = getRequestBaseUrl(request);

  // Build TikTok Ads Manager / TikTok Shop compatible Product XML Feed
  const itemsXml = (products || [])
    .map((p) => {
      const price = p.sale_price ?? p.regular_price;
      const availability = p.status === "published" ? "in_stock" : "out_of_stock";
      const brand = (p.brands as any)?.name || "Blush & Budget";
      const category = (p.categories as any)?.name || "Skincare & Beauty";
      const productUrl = `${baseUrl}/products/${p.slug}`;
      const imageUrl = p.og_image_url || `${baseUrl}/images/product-placeholder.png`;
      const sku = p.sku || p.id;

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:sku><![CDATA[${sku}]]></g:sku>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.description || p.name}]]></g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:brand><![CDATA[${brand}]]></g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price} BDT</g:price>
      ${p.sale_price ? `<g:sale_price>${p.sale_price} BDT</g:sale_price>` : ""}
      <g:google_product_category><![CDATA[Health & Beauty > Personal Care > Cosmetics > Skin Care]]></g:google_product_category>
      <g:product_type><![CDATA[${category}]]></g:product_type>
      <g:custom_label_0>TikTok Showcase</g:custom_label_0>
    </item>`;
    })
    .join("\n");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>TikTok Product Catalog Feed</title>
    <link>${baseUrl}</link>
    <description>TikTok Catalog Manager XML Data Feed for Video Shopping Ads and Dynamic Showcase</description>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}

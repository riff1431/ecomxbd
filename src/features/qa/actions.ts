"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function askQuestion(productId: string, questionText: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    return { error: "You must be signed in to ask a question." };
  }

  const adminClient = createAdminClient();

  const { data: question, error } = await adminClient
    .from("questions")
    .insert({
      product_id: productId,
      user_id: user.id,
      question: questionText.trim(),
      status: "published",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/products`);
  return { success: true, question };
}

export async function getProductQA(productId: string) {
  const adminClient = createAdminClient();

  const { data: questions, error } = await adminClient
    .from("questions")
    .select(`
      id,
      question,
      created_at,
      profiles (
        full_name
      ),
      answers (
        id,
        answer,
        is_official,
        created_at
      )
    `)
    .eq("product_id", productId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) return [];
  return questions || [];
}

export async function getAdminQA() {
  const adminClient = createAdminClient();

  const { data: questions, error } = await adminClient
    .from("questions")
    .select(`
      id,
      question,
      status,
      created_at,
      products (
        id,
        name,
        slug
      ),
      profiles (
        full_name,
        email
      ),
      answers (
        id,
        answer,
        is_official,
        created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return [];
  return questions || [];
}

export async function answerQuestion(questionId: string, answerText: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return { error: "Authentication required" };

  const adminClient = createAdminClient();

  const { data: answer, error } = await adminClient
    .from("answers")
    .insert({
      question_id: questionId,
      user_id: user.id,
      answer: answerText.trim(),
      is_official: true,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await adminClient
    .from("questions")
    .update({ status: "published" })
    .eq("id", questionId);

  revalidatePath("/admin/qa");
  return { success: true, answer };
}

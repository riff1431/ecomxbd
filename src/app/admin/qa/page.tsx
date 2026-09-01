import { getAdminQA } from "@/features/qa/actions";
import { QAListClient } from "@/features/qa/qa-list-client";

export const metadata = {
  title: "Q&A Management — Admin Dashboard",
};

export default async function AdminQAPage() {
  const questions = await getAdminQA();

  return <QAListClient initialQuestions={questions} />;
}

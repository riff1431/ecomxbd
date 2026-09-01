"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, Send, X, Loader2, CheckCircle2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/shared/ui/button";
import { answerQuestion } from "./actions";

interface QAListClientProps {
  initialQuestions: any[];
}

export function QAListClient({ initialQuestions }: QAListClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [activeModalQ, setActiveModalQ] = useState<any | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalQ || !answerText.trim()) return;

    setLoading(true);
    const res = await answerQuestion(activeModalQ.id, answerText);
    if (res.success && res.answer) {
      setQuestions(
        questions.map((q) =>
          q.id === activeModalQ.id
            ? {
                ...q,
                answers: [...(q.answers || []), res.answer],
                status: "published",
              }
            : q
        )
      );
      setActiveModalQ(null);
      setAnswerText("");
    }
    setLoading(false);
  };

  const columns: Column<any>[] = [
    {
      key: "product",
      header: "Product",
      sortable: true,
      cell: (row: any) => (
        <div className="max-w-[200px]">
          <span className="font-bold text-text text-xs line-clamp-1">
            {row.products?.name || "Product"}
          </span>
          <span className="text-[10px] text-text-muted">
            by {row.profiles?.full_name || row.profiles?.email || "Customer"}
          </span>
        </div>
      ),
    },
    {
      key: "question",
      header: "Question",
      cell: (row: any) => (
        <div className="max-w-[300px] text-xs space-y-1">
          <p className="font-semibold text-text">{row.question}</p>
          {row.answers && row.answers.length > 0 && (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-semibold">
              Answered: &quot;{row.answers[0].answer}&quot;
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
            row.answers && row.answers.length > 0
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {row.answers && row.answers.length > 0 ? "Answered" : "Pending Answer"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      cell: (row: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setActiveModalQ(row);
            setAnswerText(row.answers?.[0]?.answer || "");
          }}
          className="text-xs"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1 text-primary-600" />
          {row.answers && row.answers.length > 0 ? "Edit Answer" : "Answer"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Product Q&A Management</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Respond to customer questions about ingredients, authenticity, and skin compatibility.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={questions}
        searchKey="question"
        searchPlaceholder="Search questions..."
        emptyMessage="No customer questions found."
      />

      {/* Answer Modal */}
      {activeModalQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary-600" />
                Post Official Answer
              </h3>
              <button
                onClick={() => setActiveModalQ(null)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-surface-secondary p-3 text-xs space-y-1">
              <span className="font-bold text-text">{activeModalQ.products?.name}</span>
              <p className="text-text-secondary font-medium">Q: &quot;{activeModalQ.question}&quot;</p>
            </div>

            <form onSubmit={handleSendAnswer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Official Store Answer
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Yes, this formulation is dermatologically tested and non-comedogenic..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full rounded-xl border border-border p-3 text-xs text-text focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setActiveModalQ(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                  Publish Official Answer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

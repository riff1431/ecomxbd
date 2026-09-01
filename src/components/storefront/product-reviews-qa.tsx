"use client";

import { useState, useEffect } from "react";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { submitReview, getProductReviews } from "@/features/reviews/actions";
import { askQuestion, getProductQA } from "@/features/qa/actions";

interface ProductReviewsQAProps {
  productId: string;
}

export function ProductReviewsQA({ productId }: ProductReviewsQAProps) {
  const [activeSubTab, setActiveSubTab] = useState<"reviews" | "qa">("reviews");

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Q&A state
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionMsg, setQuestionMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    getProductReviews(productId).then(setReviews);
    getProductQA(productId).then(setQuestions);
  }, [productId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMsg(null);

    const res = await submitReview({
      product_id: productId,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    });

    if (res.error) {
      setReviewMsg({ text: res.error, isError: true });
    } else {
      setReviewMsg({ text: "Thank you! Your verified review has been submitted.", isError: false });
      setTitle("");
      setComment("");
      if (res.review) {
        setReviews([res.review, ...reviews]);
      }
    }
    setSubmittingReview(false);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setSubmittingQuestion(true);
    setQuestionMsg(null);

    const res = await askQuestion(productId, questionText);
    if (res.error) {
      setQuestionMsg({ text: res.error, isError: true });
    } else {
      setQuestionMsg({ text: "Your question has been posted! Our beauty advisor will respond shortly.", isError: false });
      setQuestionText("");
      if (res.question) {
        setQuestions([res.question, ...questions]);
      }
    }
    setSubmittingQuestion(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs: Reviews vs Q&A */}
      <div className="flex gap-4 border-b border-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab("reviews")}
          className={`flex items-center gap-1.5 pb-2 transition-colors ${
            activeSubTab === "reviews"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-text-muted hover:text-text"
          }`}
        >
          <Star className="h-4 w-4 fill-current text-amber-400" />
          <span>Customer Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("qa")}
          className={`flex items-center gap-1.5 pb-2 transition-colors ${
            activeSubTab === "qa"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-text-muted hover:text-text"
          }`}
        >
          <MessageSquare className="h-4 w-4 text-primary-600" />
          <span>Questions & Answers ({questions.length})</span>
        </button>
      </div>

      {activeSubTab === "reviews" && (
        <div className="space-y-8">
          {/* Write a Review Card */}
          <div className="rounded-2xl border border-border bg-surface-secondary/40 p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-text flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Leave a Verified Customer Review
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-text mb-1">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? "fill-current" : "stroke-current fill-none text-zinc-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-text">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent texture, leaves skin glowing!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Detailed Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your genuine experience with this skincare product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-xs focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {reviewMsg && (
                  <span
                    className={`text-xs font-semibold ${
                      reviewMsg.isError ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {reviewMsg.text}
                  </span>
                )}
                <Button type="submit" size="sm" disabled={submittingReview} className="ml-auto text-xs">
                  {submittingReview ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                  Submit Review
                </Button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-text-muted text-xs">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < r.rating ? "fill-current" : "stroke-current fill-none text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-text-muted">
                      {new Date(r.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text">
                      {r.profiles?.full_name || "Verified Customer"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.2 text-[10px] font-bold border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Purchase
                    </span>
                  </div>

                  {r.title && <h4 className="font-bold text-text text-sm">{r.title}</h4>}
                  <p className="text-text-secondary leading-relaxed">{r.comment}</p>

                  {/* Admin Reply */}
                  {r.admin_reply && (
                    <div className="mt-3 rounded-xl bg-primary-50/70 border border-primary-100 p-3 space-y-1">
                      <span className="font-bold text-[11px] text-primary-900 block">
                        Response from ecomXbangladesh Official Advisor:
                      </span>
                      <p className="text-[11px] text-primary-800 leading-relaxed">{r.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSubTab === "qa" && (
        <div className="space-y-6">
          {/* Ask Question Form */}
          <div className="rounded-2xl border border-border bg-surface-secondary/40 p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-text flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-primary-600" />
              Have a question about ingredients or usage?
            </h3>

            <form onSubmit={handleQuestionSubmit} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Is this suitable for sensitive acne-prone skin?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
              />
              <Button type="submit" size="sm" disabled={submittingQuestion} className="text-xs font-semibold">
                {submittingQuestion ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                Ask
              </Button>
            </form>

            {questionMsg && (
              <span
                className={`text-xs font-semibold block ${
                  questionMsg.isError ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {questionMsg.text}
              </span>
            )}
          </div>

          {/* Q&A List */}
          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-text-muted text-xs">
                No questions asked yet. Ask our team anything!
              </div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-extrabold text-primary-600 text-sm">Q:</span>
                    <div>
                      <p className="font-bold text-text text-sm">{q.question}</p>
                      <span className="text-[10px] text-text-muted">
                        Asked by {q.profiles?.full_name || "Customer"} on{" "}
                        {new Date(q.created_at).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>

                  {q.answers && q.answers.length > 0 ? (
                    <div className="pl-4 border-l-2 border-primary-500 space-y-2">
                      {q.answers.map((a: any) => (
                        <div key={a.id} className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-text">Answer:</span>
                            {a.is_official && (
                              <span className="rounded bg-primary-100 text-primary-800 text-[10px] font-bold px-1.5 py-0.2">
                                Official Answer
                              </span>
                            )}
                          </div>
                          <p className="text-text-secondary leading-relaxed">{a.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-text-muted italic pl-4">
                      Awaiting response from our certified beauty specialist...
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

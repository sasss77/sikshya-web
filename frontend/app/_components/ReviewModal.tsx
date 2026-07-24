"use client";

import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { createReviewAction } from "@/lib/actions/review-action";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "tutor" | "course";
  tutorId: string;
  courseId?: string;
  targetName: string;
  onSuccess: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  targetType,
  tutorId,
  courseId,
  targetName,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await createReviewAction({
      tutorId,
      targetType,
      rating,
      reviewText,
      courseId,
    });

    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || "Failed to submit review");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "450px",
        overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B4085, #1e3a8a)"
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>
            Review {targetName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px",
              padding: "0.35rem", cursor: "pointer", display: "flex",
            }}
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          {error && (
            <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.75rem" }}>
                How would you rate your experience?
              </p>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem" }}
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= star ? "#f59e0b" : "transparent"}
                      color={(hoverRating || rating) >= star ? "#f59e0b" : "#cbd5e1"}
                      style={{ transition: "all 0.15s" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.5rem" }}>
                Write your review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share details about your experience..."
                rows={4}
                style={{
                  width: "100%", padding: "0.85rem", borderRadius: "10px",
                  border: "1.5px solid #cbd5e1", fontSize: "0.9rem",
                  fontFamily: "inherit", resize: "none",
                  outline: "none", transition: "border-color 0.2s"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0B4085")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: "0.85rem", borderRadius: "10px",
                  border: "1.5px solid #cbd5e1", background: "#f8fafc",
                  color: "#475569", fontSize: "0.9rem", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1, padding: "0.85rem", borderRadius: "10px",
                  border: "none", background: "#0B4085", color: "#fff",
                  fontSize: "0.9rem", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1, transition: "all 0.15s"
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

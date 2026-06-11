"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Candidate {
  name: string;
  photo: string;
  description: string;
}

interface VotingUIProps {
  candidates: Candidate[];
  userEmail: string;
}

export default function VotingUI({ candidates, userEmail }: VotingUIProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleVote = async (candidateName: string) => {
    setSelected(candidateName);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: selected }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/thank-you");
      } else if (res.status === 409) {
        router.push("/thank-you");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {candidates.map((candidate, i) => (
          <button
            key={candidate.name}
            onClick={() => handleVote(candidate.name)}
            disabled={submitting}
            className={`
              glass-card p-6 text-left w-full cursor-pointer transition-all duration-300 relative overflow-hidden
              animate-fade-in-up
              ${i === 0 ? "delay-300" : "delay-400"}
              ${selected === candidate.name
                ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-900/30"
                : "hover:border-white/20"
              }
              disabled:cursor-not-allowed disabled:opacity-70
            `}
          >
            {selected === candidate.name && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Avatar with initials — no Image component to avoid onError issues */}
            <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center text-4xl font-bold text-indigo-300">
              {candidate.name.charAt(0)}
            </div>

            <h3 className="text-lg font-bold text-white text-center mb-1">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">{candidate.description}</p>

            <div
              className={`
                w-full py-2 rounded-lg text-sm font-medium text-center transition-all
                ${selected === candidate.name
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-gray-400 border border-white/10"
                }
              `}
            >
              {selected === candidate.name ? "✓ Selected" : "Select"}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm text-center mb-6 animate-scale-in">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 animate-fade-in-up delay-400">
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className={`
            btn-primary w-full max-w-xs py-4 text-base
            ${!selected ? "opacity-40 cursor-not-allowed" : ""}
          `}
        >
          <span className="flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>Confirm Vote</>
            )}
          </span>
        </button>

        {selected && !submitting && (
          <p className="text-gray-500 text-sm animate-fade-in-up">
            You&apos;re voting for <span className="text-indigo-400 font-medium">{selected}</span>
          </p>
        )}

        <p className="text-gray-700 text-xs text-center max-w-sm">
          Votes are final and cannot be changed. Your email ({userEmail}) will be recorded.
        </p>
      </div>
    </div>
  );
}
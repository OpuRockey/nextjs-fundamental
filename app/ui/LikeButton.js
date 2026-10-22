"use client";

import { useState } from "react";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-200 bg-white px-5 text-sm font-bold text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md" onClick={() => setLiked((value) => !value)}>
      {liked ? "♥ Liked" : "♡ Like this example"}
    </button>
  );
}

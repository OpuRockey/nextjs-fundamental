"use client";

import Link from "next/link";
import { useState } from "react";

export default function HoverPrefetchLink({ href, children, className = "" }) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      onFocus={() => setActive(true)}
    >
      {children}
    </Link>
  );
}

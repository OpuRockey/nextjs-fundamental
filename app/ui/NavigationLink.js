import Link from "next/link";
import LinkPendingIndicator from "./LinkPendingIndicator";

export default function NavigationLink({ href, children, className = "" }) {
  return (
    <Link href={href} className={`navigation-link ${className}`}>
      {children}<LinkPendingIndicator />
    </Link>
  );
}

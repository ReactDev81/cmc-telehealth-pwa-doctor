import { cn } from "@/lib/utils";
import Link from "next/link";
export function Footer() {
  // Use statically matching className on <a> for SSR/client hydration match
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 py-6 mt-auto">
      <div
        className={cn(
          "flex flex-col md:flex-row justify-between items-center gap-4 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8",
        )}
      >
        {/* Legal Links */}
        <div className="text-center md:text-left text-sm text-gray-600 order-2 md:order-1">
          All Rights Reserved Brethren Design Co. {currentYear} • Site by{" "}
          <a
            href="https://deploymeta.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue font-semibold  hover:text-gray-900 transition-colors"
          >
            Deploy Meta
          </a>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm text-gray-600 order-1 md:order-2">
          <Link
            href="/privacy-policy"
            className="hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms-conditions"
            className="hover:text-gray-900 transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

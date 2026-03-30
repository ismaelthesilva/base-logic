import { Code2, ExternalLink, Linkedin, Github } from "lucide-react";
import Link from "next/link";

export function DeveloperFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Developer Attribution */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Developed by</span>
            </div>
            <Link
              href="https://ismaelsilva.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Ismael Silva</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="hidden sm:inline text-gray-500">
              Full Stack Product Engineer
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hidden md:inline">
              Need a custom fitness platform?
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="https://linkedin.com/in/ismaelthesilva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/ismaelthesilva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

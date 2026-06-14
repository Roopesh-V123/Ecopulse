import { Leaf, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-panel mt-auto py-8 px-6 border-t border-border-main text-sm text-text-muted" role="contentinfo">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Column */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-eco-gradient flex items-center justify-center text-white shadow-md shadow-brand-emerald/20">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="font-display font-bold text-base text-text-main tracking-tight block">EcoPulse</span>
            <span className="text-xs text-text-muted">Your Personal Climate Blueprint</span>
          </div>
        </div>

        {/* Developer Credit - High Visual Priority */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1 bg-brand-emerald/5 border border-brand-emerald/10 rounded-2xl px-5 py-3">
          <span className="font-semibold text-text-main text-xs uppercase tracking-wider">Hack2Skill Submission</span>
          <span className="font-display font-medium text-brand-emerald text-sm" aria-label="Developer Credit">
            Built by V. Roopesh | ID: 252U1R1249
          </span>
          <span className="text-[10px] text-text-muted">Principal Product Architect & UX Engineer</span>
        </div>

        {/* Social / Copy Columns */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-emerald transition-colors" aria-label="GitHub Repository">
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="hover:text-brand-emerald transition-colors" aria-label="Developer Portfolio">
              <Globe className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-brand-emerald transition-colors" aria-label="Developer LinkedIn">
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} EcoPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

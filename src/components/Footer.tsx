export default function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">© {new Date().getFullYear()} Simba Shi</span>
        <div className="flex items-center gap-5">
          <a href="mailto:simba.shi@yale.edu" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
            Email
          </a>
          <a href="https://github.com/Coderrexe" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/simba-shi" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

import { ArrowUpRight, ArrowUp } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="compania">
      <div className="site-footer-inner">
        <div className="site-footer-meta">
          <p>
            © {new Date().getFullYear()} Tomoroga Construct
            <br />
            <span>Antrepriză generală, din 2004.</span>
          </p>
          <nav aria-label="Navigare subsol">
            <a href="/portofoliu">Portofoliu</a>
            <a
              href="https://www.facebook.com/tomorogaconstruct2004/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook <ArrowUpRight size={14} />
            </a>
            <a href="#continut">
              Înapoi sus <ArrowUp size={14} />
            </a>
          </nav>
        </div>
        <div className="site-footer-wordmark" aria-hidden="true">
          tomoroga
        </div>
      </div>
    </footer>
  );
}

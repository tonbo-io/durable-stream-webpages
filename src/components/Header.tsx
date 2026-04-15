import durableSessionLogo from "../assets/durable session T logo.svg";
import durableSessionLogoOrange from "../assets/durable session T logo orange.svg";
import { buildAppHref, isInternalAppPath, navigateTo } from "../utils/navigation";

type HeaderNavItem = {
  label: string;
  href?: string;
  active?: boolean;
  caret?: boolean;
  disabled?: boolean;
  children?: { label: string; href: string }[];
};

type HeaderProps = {
  navItems: HeaderNavItem[];
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

function Header({ navItems, ctaHref = "https://cal.com/tzu-gwo/hi-from-tonbo", ctaLabel = "Book demo", className }: HeaderProps) {
  const handleLinkClick = (href: string) => (event: React.MouseEvent<HTMLElement>) => {
    if (!isInternalAppPath(href)) {
      return;
    }

    event.preventDefault();
    navigateTo(href);
  };

  return (
    <header className={className ? `site-header ${className}` : "site-header"}>
      <div className="header-primary">
        <a
          className="header-brand"
          aria-label="Durable Sessions"
          href={buildAppHref("/")}
          onClick={handleLinkClick("/")}
        >
          <span className="header-brand-logo-wrap">
            <img className="header-brand-logo header-brand-logo-default" src={durableSessionLogo} alt="" />
            <img className="header-brand-logo header-brand-logo-hover" src={durableSessionLogoOrange} alt="" />
          </span>
          <span className="header-brand-divider" aria-hidden="true">
            |
          </span>
          <span className="header-brand-wordmark" onClick={handleLinkClick("/")}>
            <span className="header-brand-wordmark-accent">Durable</span>
            <span className="header-brand-wordmark-primary"> Sessions</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <div className="nav-link-group" key={item.label}>
                  <button
                    type="button"
                    className={item.active ? "nav-link nav-link-active nav-link-trigger" : "nav-link nav-link-trigger"}
                    aria-haspopup="menu"
                  >
                    <span>{item.label}</span>
                    <span className="nav-caret" aria-hidden="true" />
                  </button>
                  <div className="nav-dropdown-menu" role="menu">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        className="nav-dropdown-item"
                        href={child.href}
                        role="menuitem"
                        target={isInternalAppPath(child.href) ? undefined : "_blank"}
                        rel={isInternalAppPath(child.href) ? undefined : "noopener noreferrer"}
                        onClick={handleLinkClick(child.href)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            if (item.href && !item.disabled) {
              return (
                <a
                  key={item.label}
                  className={item.active ? "nav-link nav-link-active" : "nav-link"}
                  href={isInternalAppPath(item.href) ? buildAppHref(item.href) : item.href}
                  onClick={handleLinkClick(item.href)}
                  aria-current={item.active ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {item.caret ? <span className="nav-caret" aria-hidden="true" /> : null}
                </a>
              );
            }

            return (
              <span
                key={item.label}
                className={item.active ? "nav-link nav-link-active nav-link-disabled" : "nav-link nav-link-disabled"}
                aria-disabled="true"
              >
                <span>{item.label}</span>
                {item.caret ? <span className="nav-caret" aria-hidden="true" /> : null}
              </span>
            );
          })}
        </nav>
      </div>

      <div className="header-actions">
        <a
          className="button button-primary button-header button-header-terminal"
          href={isInternalAppPath(ctaHref) ? buildAppHref(ctaHref) : ctaHref}
          onClick={handleLinkClick(ctaHref)}
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}

export default Header;

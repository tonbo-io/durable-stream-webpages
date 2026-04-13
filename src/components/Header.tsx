import discordIcon from "../assets/discord icon.svg";
import { buildAppHref, isInternalAppPath, navigateTo } from "../utils/navigation";

type HeaderNavItem = {
  label: string;
  href?: string;
  active?: boolean;
  caret?: boolean;
  disabled?: boolean;
};

type HeaderProps = {
  navItems: HeaderNavItem[];
  ctaHref: string;
  ctaLabel: string;
  ctaVariant?: "default" | "terminal";
  showDiscord?: boolean;
};

function Header({
  navItems,
  ctaHref,
  ctaLabel,
  ctaVariant = "default",
  showDiscord = false,
}: HeaderProps) {
  const handleLinkClick = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isInternalAppPath(href)) {
      return;
    }

    event.preventDefault();
    navigateTo(href);
  };

  const ctaClassName =
    ctaVariant === "terminal"
      ? "button button-primary button-header button-header-terminal"
      : "button button-primary button-header";

  return (
    <header className="site-header">
      <div className="header-primary">
        <a
          className="brand brand-link"
          aria-label="Long Code"
          href={buildAppHref("/")}
          onClick={handleLinkClick("/")}
        >
          <span className="brand-primary">Long </span>
          <span className="brand-accent">Code</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) =>
            item.href && !item.disabled ? (
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
            ) : (
              <span
                key={item.label}
                className={item.active ? "nav-link nav-link-active nav-link-disabled" : "nav-link nav-link-disabled"}
                aria-disabled="true"
              >
                <span>{item.label}</span>
                {item.caret ? <span className="nav-caret" aria-hidden="true" /> : null}
              </span>
            ),
          )}
        </nav>
      </div>

      <div className="header-actions">
        {showDiscord ? (
          <a className="icon-button" href="https://discord.com" aria-label="Discord">
            <img src={discordIcon} alt="" />
          </a>
        ) : null}
        <a
          className={ctaClassName}
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

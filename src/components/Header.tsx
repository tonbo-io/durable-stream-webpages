import discordIcon from "../assets/discord icon.svg";

function Header() {
  return (
    <header className="site-header">
      <div className="header-primary">
        <div className="brand" aria-label="Long Code">
          <span className="brand-primary">Long </span>
          <span className="brand-accent">Code</span>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <a href="#docs">Docs</a>
          <a href="#lian">Lian</a>
        </nav>
      </div>

      <div className="header-actions">
        <a className="icon-button" href="https://discord.com" aria-label="Discord">
          <img src={discordIcon} alt="" />
        </a>
        <a className="button button-primary button-header" href="#start">
          Start Project
        </a>
      </div>
    </header>
  );
}

export default Header;

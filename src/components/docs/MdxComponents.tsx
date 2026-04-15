import { Children, type ReactNode } from "react";
import { buildAppHref, isInternalAppPath, navigateTo } from "../../utils/navigation";

type CardProps = {
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

export function Card({ title, href, icon, children }: CardProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href || !isInternalAppPath(href)) return;
    event.preventDefault();
    navigateTo(href);
  };

  const content = (
    <>
      {icon ? <span className="docs-card-icon">{icon}</span> : null}
      <span className="docs-card-title">{title}</span>
      {children ? <span className="docs-card-body">{children}</span> : null}
    </>
  );

  if (href) {
    const isInternal = isInternalAppPath(href);
    return (
      <a
        className="docs-card"
        href={isInternal ? buildAppHref(href) : href}
        onClick={handleClick}
        target={isInternal ? undefined : "_blank"}
        rel={isInternal ? undefined : "noopener noreferrer"}
      >
        {content}
      </a>
    );
  }

  return <div className="docs-card">{content}</div>;
}

type CardGroupProps = {
  cols?: number;
  children?: ReactNode;
};

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  return (
    <div
      className="docs-card-group"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

type CalloutProps = {
  children?: ReactNode;
};

function Callout({ tone, children }: CalloutProps & { tone: string }) {
  return <div className={`docs-callout docs-callout-${tone}`}>{children}</div>;
}

export function Note({ children }: CalloutProps) {
  return <Callout tone="note">{children}</Callout>;
}

export function Tip({ children }: CalloutProps) {
  return <Callout tone="tip">{children}</Callout>;
}

export function Warning({ children }: CalloutProps) {
  return <Callout tone="warning">{children}</Callout>;
}

export function Info({ children }: CalloutProps) {
  return <Callout tone="info">{children}</Callout>;
}

type StepsProps = {
  children?: ReactNode;
};

export function Steps({ children }: StepsProps) {
  return <ol className="docs-steps">{Children.toArray(children)}</ol>;
}

type StepProps = {
  title: string;
  children?: ReactNode;
};

export function Step({ title, children }: StepProps) {
  return (
    <li className="docs-step">
      <div className="docs-step-title">{title}</div>
      <div className="docs-step-body">{children}</div>
    </li>
  );
}

export const mdxComponents = {
  Card,
  CardGroup,
  Note,
  Tip,
  Warning,
  Info,
  Steps,
  Step,
};

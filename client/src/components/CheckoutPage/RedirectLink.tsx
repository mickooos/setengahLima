import React from "react";

interface RedirectLinkProps {
  redirectLink: string | null;
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ redirectLink }) => {
  if (!redirectLink) {
    return null;
  }

  return (
    <div>
      <a href={redirectLink} target="_blank" rel="noopener noreferrer" />
    </div>
  );
};

export default RedirectLink;

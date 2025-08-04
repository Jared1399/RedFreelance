import React from 'react';

export default function Image({ src = "/not_found.png", alt = "", className = "" }) {
  return (
    <img
      src={src ?? ""}
      alt={alt ?? ""}
      className={`object-cover ${className}`}
    />
  );
}

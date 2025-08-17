import React from 'react';

export default function Image(
  { src = "/not_found.png", className = "", alt }:
    { src: string; className: string; alt: string }
) {
  return (
    <img
      src={src ?? ""}
      alt={alt}
      className={`object-cover ${className}`}
    />
  );
}

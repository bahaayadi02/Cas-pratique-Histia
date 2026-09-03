"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  perspective?: number;
  glareOpacity?: number;
  accentColor?: string;
  className?: string;
}

export function TiltCard({
  children,
  maxTilt = 10,
  perspective = 1000,
  glareOpacity = 0.25,
  accentColor = "#3B9EF5",
  className,
  style,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const width = rect.width;
      const height = rect.height;

      const middleX = width / 2;
      const middleY = height / 2;

      const offsetX = ((clientX - middleX) / middleX) * maxTilt;
      const offsetY = ((clientY - middleY) / middleY) * -maxTilt;

      const glareX = (clientX / width) * 100;
      const glareY = (clientY / height) * 100;

      setTilt({ rotateX: offsetY, rotateY: offsetX });
      setGlare({ x: glareX, y: glareY, opacity: glareOpacity });
    },
    [maxTilt, glareOpacity],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("tilt-card-root", className)}
      style={
        {
          ...style,
          "--accent": accentColor,
          perspective: `${perspective}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className="tilt-card-inner"
        style={{
          transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
            isHovered ? "scale3d(1.015, 1.015, 1.015)" : "scale3d(1, 1, 1)"
          }`,
          transition: isHovered
            ? "transform 0.12s cubic-bezier(0.2, 0, 0, 1)"
            : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Accent glow on corner */}
        <div
          className="tilt-card-glow"
          style={{
            background: `radial-gradient(circle at 8% 8%, color-mix(in srgb, ${accentColor} 50%, transparent) 0%, transparent 68%)`,
          }}
        />

        {/* Specular glare reflection tracking mouse */}
        <div
          className="tilt-card-glare"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 65%)`,
            transition: isHovered ? "opacity 0.15s ease" : "opacity 0.4s ease",
          }}
        />

        {/* Card Content with 3D Depth */}
        <div className="tilt-card-content">{children}</div>
      </div>
    </div>
  );
}

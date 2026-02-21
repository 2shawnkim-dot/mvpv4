import React from "react";
import { T } from "./tokens.js";

export function BackBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: T.mono,
        fontWeight: 500,
        fontSize: 12,
        color: T.muted,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0 0 12px",
        letterSpacing: 0.5,
      }}
    >
      {"<-"} {label || "Back"}
    </button>
  );
}

export function Badge({ level }) {
  const labels = { 1: "VERIFIED", 2: "ID VERIFIED", 3: "FULLY VERIFIED" };
  return (
    <span
      style={{
        fontFamily: T.mono,
        fontWeight: 600,
        fontSize: 9,
        padding: "2px 7px",
        borderRadius: 4,
        background: T.sage + "18",
        color: T.sage,
        letterSpacing: 0.8,
      }}
    >
      {labels[level] || "VERIFIED"}
    </span>
  );
}

export function Pill({ text, color }) {
  const c = color || T.sage;
  return (
    <span
      style={{
        fontFamily: T.mono,
        fontWeight: 500,
        fontSize: 10,
        padding: "3px 10px",
        borderRadius: 20,
        background: c + "14",
        color: c,
        border: "1px solid " + c + "28",
        letterSpacing: 0.8,
      }}
    >
      {text}
    </span>
  );
}

export function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: T.body, fontWeight: 500, fontSize: 12, color: T.text }}>
          {label}
        </span>
        <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 12, color: color }}>
          {score}
        </span>
      </div>
      <div style={{ height: 4, background: T.border, borderRadius: 2 }}>
        <div
          style={{
            height: "100%",
            width: score + "%",
            background: color,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.card,
        borderRadius: 16,
        border: "1px solid " + T.border,
        padding: "18px 20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Btn({ children, primary, full, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: full ? "100%" : "auto",
        padding: "13px 24px",
        borderRadius: 12,
        border: primary ? "none" : "1.5px solid " + T.border,
        background: primary ? T.dark : T.card,
        color: primary ? T.cream : T.text,
        fontFamily: T.body,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        letterSpacing: 0.2,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SectionLabel({ text }) {
  return (
    <div
      style={{
        fontFamily: T.mono,
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: 2,
        color: T.muted,
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {text}
    </div>
  );
}

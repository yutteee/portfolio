import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  color?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({ children, onClick, color = "primary" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
        border: "none",
        background: color === "primary" ? "#0070f3" : "#eaeaea",
        color: color === "primary" ? "#fff" : "#333",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}; 
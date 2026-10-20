import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NARA - Connect Hub",
  description: "Agente de IA do Connect Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

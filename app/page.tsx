"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/nara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Erro ao conectar com a NARA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">NARA - Connect Hub</h1>
      <p className="text-lg mb-8">Agente de IA do Connect Hub</p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Faça uma pergunta à NARA..."
          className="w-full p-3 border rounded mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Pensando..." : "Enviar"}
        </button>
      </form>

      {response && (
        <div className="mt-8 p-4 bg-gray-100 rounded max-w-lg w-full">
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}

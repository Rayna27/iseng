import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setOutput(data.article);
    setLoading(false);
  };

  const handleCopy = () => {
    const el = document.getElementById("article-result");
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 Generator Artikel Otomatis</h1>

      <textarea
        className="w-full border p-4 mb-4 rounded"
        placeholder="Masukkan topik artikel kamu..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={3}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Menulis..." : "Generate"}
      </button>

      {output && (
        <div className="mt-6">
          <button
            onClick={handleCopy}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📋 Copy Artikel
          </button>

          <div
            id="article-result"
            className="whitespace-pre-wrap border p-4 rounded bg-gray-100"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      )}
    </div>
  );
}
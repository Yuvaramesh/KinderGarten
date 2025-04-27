import ReactMarkdown from "react-markdown";

export function AIText({ text }: { text: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

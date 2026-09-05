// Filepath: components/JsonLd.tsx
// Version: 1.0
// Nome da Versão: "Injeta JSON-LD (schema.org) como <script>"
// Baseado na Versão: N/A

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

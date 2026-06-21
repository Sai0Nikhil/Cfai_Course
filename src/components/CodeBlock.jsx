import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

export default function CodeBlock({ code, language = 'python', filename = 'solution.py' }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container">
      <div className="code-header">
        <span>{filename} ({language})</span>
        <button className="copy-btn" onClick={copyToClipboard}>
          {copied ? (
            <>
              <Check size={12} className="text-sage" />
              <span style={{ color: 'var(--sage)' }}>Copied!</span>
            </>
          ) : (
            <>
              <Clipboard size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre' }}>
        <code style={{ background: 'transparent', padding: 0, color: 'var(--text-primary)' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

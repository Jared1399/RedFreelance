import React from 'react';

interface Message {
  sender: string;
  text: string;
  metadata?: { type: string; url: string, read: boolean };
}

async function downloadFile(url: string, filename: string) {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('Failed to fetch file');

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(blobUrl);
}

export default function Message({ msg }: { msg: Message }) {

  const msgContent = msg.metadata?.type === "multimedia" && msg.metadata.url ?
    (
      <span>
        <a
          onClick={() => downloadFile(msg.metadata!.url, msg.text)}
          className="cursor-pointer underline"
        >
          📁{msg.text}
        </a>
      </span>
    )
    :
    (
      msg.text
    );

  return (
    <div className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 
          py-2 
          rounded-lg 
          max-w-xs 
          h-fit
          whitespace-normal
          break-words
          ${msg.sender === "me" ? "bg-amber-700 text-white" : "bg-gray-300 text-black"}
          ${msg.metadata?.type == "multimedia" ? "font-bold underline cursor-pointer" : ""}
          `}
      >
        {msgContent}
      </div>
    </div >
  );
}
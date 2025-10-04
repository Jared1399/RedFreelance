import React from 'react';
import { LocalMsg } from '../types/Chat';
import DeliveryMsg from './DeliveryMsg';

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

const messageOptions = (msg: LocalMsg): React.ReactNode => {
  if (!msg.metadata?.type) return msg.text;

  const messageTypes: Record<string, React.ReactNode> = {
    multimedia: (
      <span>
        <a
          onClick={() => msg.metadata?.url && downloadFile(msg.metadata.url, msg.text)}
          className="cursor-pointer underline"
        >
          📁{msg.text}
        </a>
      </span>
    ),
    delivery: <DeliveryMsg msg={msg} downloadHandler={downloadFile} />,
  };

  return messageTypes[msg.metadata.type] ?? msg.text;
};

export default function Message({ msg }: { msg: LocalMsg }) {

  const msgContent = messageOptions(msg);

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
          ${msg.metadata?.type === "delivery" ? "border-2 border-white" : ""}
          ${msg.metadata?.type == "multimedia" ? "font-bold underline cursor-pointer" : ""}
          `}
      >
        {msgContent}
      </div>
    </div >
  );
}
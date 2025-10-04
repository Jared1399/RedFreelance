import React from 'react';
import { LocalMsg, Metadata } from '../types/Chat';
import MarkdownViewer from '@/components/MarkdownViewer';


export default function DeliveryMsg(
  { msg, downloadHandler }:
    { msg: LocalMsg, downloadHandler: (url: string, filename: string) => void }
) {
  const meta = msg.metadata as Metadata;
  const url = meta?.url;

  return (
    <div>
      <div className="space-y-2">
        <div className="font-semibold">Entrega</div>

        <div className="text-sm">
          <MarkdownViewer content={msg.text} />
        </div>
        {url && (
          <>
            {['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].some(ext =>
              url.endsWith(`.${ext}`)
            ) && (
                <img
                  src={url}
                  alt="Archivo adjunto"
                  className="max-w-full h-auto rounded-lg mb-2"
                />
              )}

            <a
              onClick={(e) => {
                e.preventDefault();
                downloadHandler(url, msg.text || 'archivo');
              }}
              className="cursor-pointer underline text-sm "
            >
              📁 Descargar adjunto
            </a>
          </>
        )}

      </div>
    </div>
  );


}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import transactionService from "../transaction.service";
import { ConversationInterface, MessageInterface, LocalMsg } from "../types/Chat";
import { TransactionInterface } from "../types/Transaction";

type UseChatReturn = {
  messages: LocalMsg[];
  conversation: ConversationInterface | null;
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  resetFile: boolean;
  setResetFile: (v: boolean) => void;
  sendMessage: (text?: string, file?: File | null) => Promise<boolean>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function useChat(
  currTransaction: TransactionInterface | undefined,
  sessionUserId?: string | null
): UseChatReturn {
  const [messages, setMessages] = useState<LocalMsg[]>([]);
  const [conversation, setConversation] = useState<ConversationInterface | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetFile, setResetFile] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url) return;

    socketRef.current = io(url);

    const handleMessage = (msg: { text: string; senderId?: string }) => {
      const sender: LocalMsg["sender"] = msg.senderId === sessionUserId ? "me" : "other";
      setMessages((prev) => [...prev, { text: msg.text, sender }]);
    };

    socketRef.current.on("message", handleMessage);

    return () => {
      socketRef.current?.off("message", handleMessage);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [sessionUserId]);

  useEffect(() => {
    let mounted = true;

    const fetchConversation = async () => {
      try {
        const transactionRef = currTransaction;
        if (!transactionRef) return;

        const initialMsg: LocalMsg = {
          text: transactionRef.requestDetails || "",
          sender: transactionRef.clientId === sessionUserId ? "me" : "other",
        };

        setMessages([initialMsg]);

        const convRes = await transactionService.getConversationByTransactionId(transactionRef.id);

        const conv = convRes?.conversation ?? convRes ?? null;

        if (!conv) {
          const body = await transactionService.createConversation(
            transactionRef.clientId,
            transactionRef.freelancerId,
            transactionRef.id
          );

          if (body?.ok) {
            const newConvRes = await transactionService.getConversationByTransactionId(
              transactionRef.id
            );
            const newConv = newConvRes?.conversation ?? newConvRes ?? null;
            if (mounted) setConversation(newConv ?? null);
          }

          return;
        }

        const loaded: LocalMsg[] = conv.messages.map((m: MessageInterface) => ({
          text: m.text,
          sender: m.senderId === sessionUserId ? "me" : "other",
          metadata: m.metadata,
        }));

        if (mounted) {
          setConversation(conv);
          setMessages([initialMsg, ...loaded]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();

    return () => {
      mounted = false;
    };
  }, [currTransaction, sessionUserId]);

  const sendMessage = useCallback(
    async (text?: string, file?: File | null) => {
      try {
        if ((!text || !text.trim()) && !file) return false;

        const newMsgs: LocalMsg[] = [];

        if (file && sessionUserId && currTransaction?.id && conversation) {
          const { ok, message } = await transactionService.sendAttachment(
            file,
            sessionUserId,
            conversation.id
          );

          if (ok && message) {
            newMsgs.push({ ...message, sender: "me" });
          }
          setSelectedFile(null);
          setResetFile(!resetFile);
        }

        if (text && text.trim() && sessionUserId && conversation?.id) {
          const t = text.trim();
          await transactionService.sendMessage(sessionUserId, conversation.id, t);
          newMsgs.push({ text: t, sender: "me" });
        }

        if (newMsgs.length > 0) {
          setMessages((prev) => [...prev, ...newMsgs]);
          newMsgs.forEach((msg) => socketRef.current?.emit(
            "message",
            { ...msg, senderId: sessionUserId }
          ));
        }

        return true;
      } catch (err) {
        console.error("Error sending message or attachment", err);
        return false;
      }
    },
    [conversation, currTransaction?.id, resetFile, sessionUserId]
  );

  return {
    messages,
    conversation,
    selectedFile,
    setSelectedFile,
    resetFile,
    setResetFile,
    sendMessage,
    messagesContainerRef,
    messagesEndRef,
  };
}

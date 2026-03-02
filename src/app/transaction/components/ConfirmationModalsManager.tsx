"use client";
import React from "react";
import ConfirmationModal from "./ConfirmationModal";
import transactionService from "../transaction.service";
import { TransactionInterface } from "../types/Transaction";
import { TransactionContextType } from "../hooks/UseTransaction/context";

type TransactionActions = TransactionContextType["actions"];

interface Props {
  currTransaction: TransactionInterface | null | undefined;
  actions: TransactionActions;
  sessionUserId?: string | undefined;
  setTimeoutWarning: (v: boolean) => void;
  timeoutWarning?: boolean;
  isFreelancer?: boolean;
}

export default function ConfirmationModalsManager({
  currTransaction,
  actions,
  sessionUserId,
  setTimeoutWarning,
  isFreelancer,
  timeoutWarning = false
}: Props) {

  if (!currTransaction || !sessionUserId) return;

  const deliveryAllowed = [
    "payment_approved",
    "disputed",
    "on_review",
    "delivered",
  ];

  const canDeliver = deliveryAllowed.includes(currTransaction?.lifecycle?.name);

  const acceptTransaction = currTransaction?.lifecycle?.name == "requested" && (
    <ConfirmationModal
      label="Comenzar con este trabajo?"
      handlers={{
        accept: () => actions.updateTransactionLifeCycle("payment_pending"),
        deny: () => actions.updateTransactionLifeCycle("rejected_on_request"),
      }}
    />
  );

  const acceptDelivery = currTransaction?.lifecycle?.name == "on_review" && (
    <ConfirmationModal
      label="La entrega ha sido realizada, aceptar y finalizar trabajo?"
      handlers={{
        accept: () => actions.updateTransactionLifeCycle("completed"),
        deny: () => actions.updateTransactionLifeCycle("disputed"),
      }}
    />
  );

  const baseDeliveryTime = currTransaction.tier?.deliveryTime ?? 0;

  const requests = currTransaction?.requests ?? [];
  const lastRequest = requests[requests.length - 1];
  const hasRequests = requests.length > 0;

  const shouldShowNewRequestModal =
    !acceptTransaction &&
    !acceptDelivery &&
    Boolean(currTransaction) &&
    canDeliver &&
    !hasRequests;

  const shouldShowForeignRequestModal =
    !acceptTransaction &&
    !acceptDelivery &&
    canDeliver &&
    hasRequests &&
    lastRequest &&
    lastRequest.requesterId !== sessionUserId &&
    lastRequest.status == "PENDING";

  const newRequestModal = (
    <ConfirmationModal
      label={`
      Esta transacción está a punto de expirar. 
      ¿Deseas realizar una solicitud para extender el plazo por 
      ${baseDeliveryTime <= 1 ? "2" : baseDeliveryTime} días más?
    `}
      handlers={{
        accept: async () => {
          if (!sessionUserId) return;
          await transactionService.createTransactionRequest(
            baseDeliveryTime <= 1 ? 2 : baseDeliveryTime,
            currTransaction.id
          );

          setTimeoutWarning(false);
        },
        deny: async () => {
          if (!sessionUserId) return;
          await transactionService.createTransactionRequest(
            baseDeliveryTime <= 1 ? 2 : baseDeliveryTime,
            currTransaction.id,
            "REJECTED"
          );
          setTimeoutWarning(false);
        },
      }}
    />
  );

  const foreignRequestModal = (
    <ConfirmationModal
      label={`
      Se ha hecho una solicitud de extensión del plazo.
      ¿Deseas aceptarla o rechazarla?
    `}
      handlers={{
        accept: async () => {
          interface TransactionRes {
            ok: boolean;
            updatedTransaction: TransactionInterface;
          }

          await transactionService.updateTransactionRequest(lastRequest.id, "ACCEPTED");

          const res = await transactionService.extendTransactionDate(
            currTransaction.id,
            lastRequest.details.daysToExtend
          );
          const { updatedTransaction } = (await res.json()) as TransactionRes;

          actions.handleExpDateLocal(updatedTransaction.expirationDate);

          setTimeoutWarning(false);
        },
        deny: async () => {
          await transactionService.updateTransactionRequest(lastRequest.id, "REJECTED");
          setTimeoutWarning(false);
        },
      }}
    />
  );

  return (
    <>
      {isFreelancer ? acceptTransaction : acceptDelivery}
      {timeoutWarning && shouldShowNewRequestModal ? newRequestModal : null}
      {timeoutWarning && shouldShowForeignRequestModal ? foreignRequestModal : null}
    </>
  );
}

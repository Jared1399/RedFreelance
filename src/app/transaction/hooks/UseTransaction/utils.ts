export const disabledStatus = (lifecycle?: { name?: string } | null) => {
  const disabledStates = [
    "cancelled_by_client",
    "cancelled_by_freelancer",
    "rejected_on_request",
    "transaction_timeout",
    "payment_failed",
    "completed",
  ];

  if (!lifecycle || !lifecycle.name) return false;

  return disabledStates.some((state) => state === lifecycle.name);
};

export const disabledByDate = (expirationDate?: Date | string | null) => {
  if (!expirationDate) return false;

  const today = new Date();
  const expiration = expirationDate instanceof Date ? expirationDate : new Date(expirationDate);

  if (isNaN(expiration.getTime())) return false;

  return today > expiration;
};

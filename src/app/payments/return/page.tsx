import { tx } from "@/lib/transbank";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Esta página recibe los datos de Transbank (token_ws)
export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token_ws as string;
  const tbkToken = resolvedParams.TBK_TOKEN as string; // Pasa si el usuario aborta

  // 1. Manejo de Aborto (usuario apretó "Anular compra" en el formulario webpay)
  if (!token && tbkToken) {
    // Buscar pago por tbkToken y marcar como fallido/abortado
    await prisma.payment.update({
      where: { token: tbkToken },
      data: { status: "failed" }
    });
    return <div>La compra fue anulada por el usuario.</div>; // O redirect a /error
  }

  if (!token) {
    return <div>Error: No token received</div>;
  }

  // 2. Confirmar transacción (COMMIT)
  // ESTE ES EL PASO CRUCIAL. Si no haces commit, la plata se devuelve.
  let commitResponse;
  let status = "failed";

  try {
    commitResponse = await tx.commit(token);

    // Verificar respuesta de Transbank
    if (commitResponse.response_code === 0 && commitResponse.status === 'AUTHORIZED') {
      status = "paid";
    }
  } catch (error) {
    console.error("Error en commit:", error);
    // Si falla el commit (ej: token ya usado o expirado), status queda en failed
  }

  // 3. Actualizar base de datos
  // Primero buscamos el payment asociado al token
  const existingPayment = await prisma.payment.findFirst({
    where: { token: token },
  });

  if (existingPayment) {
    // Actualizamos el Payment
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        status: status === "paid" ? "paid" : "failed",
        authorizationCode: commitResponse?.authorization_code,
        cardType: commitResponse?.payment_type_code, // Webpay devuelve códigos tipo VN, SI, etc.
        cardLast4: commitResponse?.card_detail?.card_number,
        transactionDate: commitResponse?.transaction_date ?
          new Date(commitResponse.transaction_date) :
          undefined,
        raw: commitResponse || {},
        responseCode: commitResponse?.response_code,
        installments: commitResponse?.installments_number
      },
    });

    const nextLifeCycle = await prisma.lifecycle.findFirst({
      where: {
        name: 'payment_approved'
      }
    });
    // Si fue pagado exitosamente, actualizamos la Transacción Principal
    if (status === "paid" && nextLifeCycle) {
      await prisma.transaction.update({
        where: { id: existingPayment.transactionId },
        data: {
          lifecycleId: nextLifeCycle.id,
          paymentId: existingPayment.id,
          escrowStatus: "held",
        }
      });
    }
  }

  // 4. Mostrar resultado al usuario
  if (status === "paid") {
    // Redirigir a una página bonita de éxito
    redirect(`
      /transaction?transactionId=${existingPayment?.transactionId || ''}
      &payment_status=success&p_id=${existingPayment?.id || ''}
    `);
  } else {
    // Redirigir a error
    redirect(`
      /transaction?transactionId=${existingPayment?.transactionId || ''}
      &payment_status=error&p_id=${existingPayment?.id || ''}
    `);
  }

  return <div>Procesando pago...</div>;
}
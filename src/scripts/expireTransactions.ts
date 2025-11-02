/* eslint-disable no-console */
import { PrismaClient } from "../generated/prisma/index.js";

type Lifecycle = {
  id: number;
  name: string;
}

type Transaction = {
  id: string;
  lifecycleId: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  dueDate: Date | null;
  expirationDate: Date;
  completed: boolean;
}

async function expireTransactions() {
  console.log("Expire transactions cron job starting...");

  const prisma = new PrismaClient();

  try {
    const timedOut = await prisma.lifecycle.findMany({
      where: { name: { in: ["requested", "payment_pending", "on_review"] } },
    });

    const timeOutLifecycle = await prisma.lifecycle.findFirst({
      where: { name: "transaction_timeout" },
    });

    if (!timeOutLifecycle) {
      console.error("Lifecycle 'transaction_timeout' not found.");
      return;
    }

    const timedOutIds = timedOut.map((row: Lifecycle) => row.id);

    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        lifecycleId: { in: timedOutIds },
        expirationDate: { lt: new Date() },
      },
    });

    if (expiredTransactions.length > 0) {
      await prisma.transaction.updateMany({
        where: { id: { in: expiredTransactions.map((t: Transaction) => t.id) } },
        data: { lifecycleId: timeOutLifecycle.id },
      });

      console.info(
        `${expiredTransactions.length} expired transactions: [${expiredTransactions
          .map((t: Transaction) => t.id)
          .join(", ")}]`
      );
    } else {
      console.log("No expired transaccions.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

expireTransactions()
  .then(() => {
    console.log("Expire transactions completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal:", error);
    process.exit(1);
  });

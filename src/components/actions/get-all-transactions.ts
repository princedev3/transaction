import { Transaction } from "@prisma/client";
import { UserId } from "./get-user";
import prisma from "@/libs/prisma";
import { revalidatePath } from "next/cache";

interface TransactionResult {
  data?: Transaction[];
  error?: string;
}
export const getAllTransactions = async (): Promise<TransactionResult> => {
  try {
    const user = await UserId();
    const allTransactions = await prisma.transaction.findMany({
      where: {
        userId: user?.id,
      },
    });
    return { data: allTransactions };
  } catch (error) {
    console.log(error);
    return { error: "can not get all transaction" };
  }
};

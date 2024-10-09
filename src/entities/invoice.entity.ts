import { z } from "zod";
import { DateTime } from "chanfana";
import {v4 as uuidv4} from "uuid";
import { PaymentStatus } from "../const/payment-status";
import { InvoiceStatus } from "../const/invoice-status";

export const InvoiceSchema = z.object({
	id: z.string().default(() => uuidv4()),
	amount: z.number().positive().optional(),
	customer_id: z.string().optional(),
	payment_date: DateTime().optional(),
	due_date: DateTime().optional(),
	payment_status: z.enum(Object.values(PaymentStatus) as [string, ...string[]]).optional(),
	status: z.enum(Object.values(InvoiceStatus) as [string, ...string[]]).optional(),
});

export type InvoiceInput = z.infer<typeof InvoiceSchema>;
export type Invoice = InvoiceInput & {
	createdAt: string;
	updatedAt: string;
};

export const CreateInvoiceSchema = InvoiceSchema.omit({ id: true });

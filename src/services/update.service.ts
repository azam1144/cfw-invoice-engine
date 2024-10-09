import {DateTime} from "luxon";
import { OpenAPIRoute } from "chanfana";
import {Invoice, InvoiceSchema} from "../entities/invoice.entity";
import {UpdateSchemaValidator} from "../swagger/update.schema.validator";

export class UpdateInvoiceService extends OpenAPIRoute {
	schema = UpdateSchemaValidator;

	async handle(c: any) {
		const id = c.req.param('id');
		const result = InvoiceSchema.safeParse(await c.req.json());
		if (!result.success) {
			return c.json({ success: false, error: 'Invalid invoice plan data' }, 400);
		}

		const existing = await c.env.INVOICE_KV.get(id);
		if (!existing) {
			return c.json({ success: false, error: 'Invalid invoice' }, 404);
		}

		const update: Partial<Invoice> = {
			...JSON.parse(existing),
			...result.data,
			updatedAt: DateTime.now().toISO(),
		};
		await c.env.INVOICE_KV.put(id, JSON.stringify(update));
		return c.json({
			success: true,
			result: {
				data: JSON.parse(await c.env.INVOICE_KV.get(id))
			}
		}, 201);
	}
}

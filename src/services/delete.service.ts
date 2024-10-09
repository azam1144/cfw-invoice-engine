import { DateTime } from "luxon";
import { OpenAPIRoute } from "chanfana";
import { Invoice } from "../entities/invoice.entity";
import { InvoiceStatus } from "../const/invoice-status";
import { DeleteSchemaValidator } from "../swagger/delete.schema.validator";

export class DeleteInvoiceService extends OpenAPIRoute {
	schema = DeleteSchemaValidator;

	async handle(c: any) {
		const id = c.req.param('id');
		const existing = await c.env.INVOICE_KV.get(id);
		if (!existing) {
			return c.json({ success: false, error: 'Invalid Invoice' }, 404);
		}

		const update: Partial<Invoice> = {
			...JSON.parse(existing),
			status: InvoiceStatus.DELETED,
			updatedAt: DateTime.now().toISO(),
		};
		await c.env.INVOICE_KV.put(id, JSON.stringify(update));

		return c.json({
			success: true,
			result: {
				data: JSON.parse(existing)
			}
		}, 200);
	}
}

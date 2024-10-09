import { OpenAPIRoute } from "chanfana";
import {OneSchemaValidator} from "../swagger/one.schema.validator";

export class OneInvoiceService extends OpenAPIRoute {
	schema = OneSchemaValidator;

	async handle(context: any) {
		console.log('========================== ONE INVOICE ==========================: ');

		const id = context.req.param('id');
		const existing = await context.env.INVOICE_KV.get(id);
		console.log('existing: ', existing);

		if (!existing) {
			return context.json({ success: false, error: 'Invalid invoice' }, 404);
		}
		return context.json({
			success: true,
			result: {
				data: JSON.parse(existing)
			}
		}, 201);
	}
}

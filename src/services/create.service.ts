import { OpenAPIRoute } from "chanfana";
import { InvoiceSchema } from "../entities/invoice.entity";
import { PerformBillingService } from "./perform-billing.service";
import { createSchemaValidator } from "../swagger/create.schema.validator";
import { stringToBoolean } from "../core/utils";

const performBillingService = new PerformBillingService();
export class GenerateInvoice extends OpenAPIRoute {
	schema = createSchemaValidator;

	async handle(context: any) {
		const payload = await context.req.json();
		const query = context.req.query();
		console.log('query: ', query);

		const result = InvoiceSchema.safeParse(await context.req.json());
		if (!result.success) {
		// 	return context.json({ success: false, error: 'Invalid Invoice data', details: result.error }, 400);
		}
		console.log('query.processPayment: ', query?.processPayment);

		try {
			const processPayment = stringToBoolean(query.processPayment);
			console.log('processPayment: ', processPayment);

			const resp = await performBillingService.execute(context, payload, processPayment);
			if (resp.success) {
				return context.json({
					success: resp.success,
					result: {
						data: resp.data,
					}
				}, 201);
			}
			return context.json({
				success: false,
				message: resp.error,
			}, resp.code);
		} catch (err) {
			if (err instanceof Error) {
				return context.json({
					success: false,
					message: err.message,
				}, (err as any).code || 402);
			}

			// Handle the case where it's not an error
			return context.json({
				success: false,
				message: 'An unknown error occurred',
			}, 500);
		}
	}
}

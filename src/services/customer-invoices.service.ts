import { OpenAPIRoute } from "chanfana";
import { getPage, pagination } from "../core/utils";
import { Invoice } from "../entities/invoice.entity";
import { CustomerInvoicesSchemaValidator } from "../swagger/customer-invoices.schema.validator";

export class InvoiceByCustomerService extends OpenAPIRoute {
	schema = CustomerInvoicesSchemaValidator;

	// Handle retrieving invoices for a specific customer
	async handle(c: any) {
		const customer_id = c.req.param('customer_id'); // Get the customer ID from request parameters
		const data = await this.getValidatedData<typeof this.schema>(); // Validate incoming data
		let { page } = data.query;
		page = getPage(page); // Normalize the page number

		// Retrieve all invoice keys from the database
		const keys = await c.env.INVOICE_KV.list();
		const { totalPages, startIndex, endIndex } = pagination(page, keys.keys.length);

		const invoices: Invoice[] = [];
		// Iterate through the keys to find invoices associated with the specified customer ID
		for (const key of keys.keys.slice(startIndex, endIndex)) {
			const invoice = await c.env.INVOICE_KV.get(key.name);
			if (invoice) {
				const parsed = JSON.parse(invoice) as Invoice;
				// Check if the invoice belongs to the specified customer
				if (parsed.customer_id === customer_id) {
					invoices.push(parsed);
				}
			}
		}

		// Return success response with invoice data and pagination info
		return c.json({
			success: true,
			result: {
				data: invoices
			},
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalCount: keys.keys.length,
			},
		}, 200);
	}
}
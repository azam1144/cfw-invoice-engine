import { OpenAPIRoute } from "chanfana";
import {getPage, pagination} from "../core/utils";
import {Invoice} from "../entities/invoice.entity";
import {listSchemaValidator} from "../swagger/list.schema.validator";

export class ListAllInvoice extends OpenAPIRoute {
	schema = listSchemaValidator;

	async handle(c: any) {
		console.log('c:', c);
		const data = await this.getValidatedData<typeof this.schema>();
		console.log('data: ', data);

		let { page } = data.query;
		page = getPage(page);
		console.log('data: ', data);

		const keys = await c.env.INVOICE_KV.list();
		const {totalPages, startIndex, endIndex} = pagination(page, keys.keys.length);

		const invoices: Invoice[] = [];
		for (const key of keys.keys.slice(startIndex, endIndex)) {
			const invoice = await c.env.INVOICE_KV.get(key.name);
			if (invoice) {
				invoices.push(JSON.parse(invoice) as Invoice);
			}
		}

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

import {OpenAPIRoute} from "chanfana";
import {InvoiceStatus} from "../const/invoice-status";
import {PaymentStatus} from "../const/payment-status";
import {StaticTypesSchemaValidator} from "../swagger/static-types.schema.validator";

export class StaticTypesService extends OpenAPIRoute {
	schema = StaticTypesSchemaValidator;
	async handle(context: any): Promise<any> {
		return {
			invoiceStatus: Object.values(InvoiceStatus),
			paymentStatus: Object.values(PaymentStatus),
		}
	}
}

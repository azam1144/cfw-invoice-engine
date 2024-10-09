import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { RpcService } from "./rpc.service";
import { Invoice } from "../entities/invoice.entity";
import { PaymentStatus } from "../const/payment-status";
import { getDateOnly, serializeResponse } from "../core/utils";
import { PaymentMethod } from "../const/payment-payload.type";
import { SendNotificationType } from "../const/send-notification.type";

export class PerformBillingService {
    private rpcService;

    constructor() {}

    // Execute billing process
    async execute(context, payload: any, processPayment?: boolean): Promise<any> {
        this.rpcService = new RpcService(context);

        // Retrieve customer information
        let customer: any = await this.rpcService.getOneCustomer(payload.customer_id);
        if (!customer.success) {
            return { success: false, error: 'Invalid customer', code: 400 };
        }

        // Create and store the invoice
        let invoice: Invoice = {
            id: uuidv4(),
            ...payload,
            createdAt: DateTime.now().toISO(),
            updatedAt: DateTime.now().toISO(),
        };
        await context.env.INVOICE_KV.put(invoice.id, JSON.stringify(invoice));

        if (invoice.id) {
            customer = serializeResponse(customer); // Serialize customer response
            const content = await this.prepareEmailContent(customer, invoice); // Prepare email content

            // Prepare notification payload
            const sendNotificationPayload: SendNotificationType = {
                customer_id: invoice.customer_id,
                invoice_id: invoice.id,
                content,
            };
            const notificationResp = await this.rpcService.sendNotification(sendNotificationPayload);

            // Process payment if required
            if (processPayment) {
                const paymentPayload: PaymentMethod = {
                    amount: invoice.amount,
                    invoice_id: invoice.id,
                    customer_id: payload.customer_id,
                    payment_method: 'CreditCard',
                    payment_date: invoice.payment_date,
                };
                const paymentResp = await this.rpcService.makePayment(paymentPayload);

                // Update invoice based on payment response
                let UpdateInvoice;
                if (paymentResp.success) {
                    UpdateInvoice = {
                        ...invoice,
                        payment_status: PaymentStatus.PAID,
                        updatedAt: DateTime.now().toISO(),
                    };
                    await context.env.INVOICE_KV.put(invoice.id, JSON.stringify(UpdateInvoice));

                    return context.json({
                        success: true,
                        result: {
                            data: paymentResp,
                        },
                    }, 201);
                } else {
                    UpdateInvoice = {
                        ...invoice,
                        payment_status: PaymentStatus.FAILED,
                        updatedAt: DateTime.now().toISO(),
                    };
                }
                await context.env.INVOICE_KV.put(invoice.id, JSON.stringify(UpdateInvoice));
            }

            // Return success response if notification was sent
            if (notificationResp.success) {
                return context.json({
                    success: true,
                    result: {
                        data: invoice,
                    },
                }, 201);
            }
            return context.json({
                success: false,
                message: notificationResp.message,
            }, notificationResp.code);
        }
    }

    // Prepare email content for the customer
    async prepareEmailContent(customer: any, invoice: any): Promise<string> {
        let subscription: any = await this.rpcService.getOneSubscription(customer.subscriptionPlanId);
        subscription = serializeResponse(subscription);

        return `<b>Invoice generated successfully!</b> \n\n ` +
            `Hello ${customer?.name ?? ''} \n` +
            `Your invoice has been generated with the following details: \n` +
            `Subscription: <b>${subscription?.name ?? ''}</b> \n` +
            `Total Amount: ${invoice?.amount ?? 0} \n` +
            `Period: ${getDateOnly(invoice.payment_date)} \n\n`;
    }
}
import {Context} from "hono";
import {api, ApiResponse} from "../core/utils";
import {PaymentMethod} from "../const/payment-payload.type";
import {SendNotificationType} from "../const/send-notification.type";

export class RpcService {
    private context;
    constructor(context: Context) {
        this.context = context;
    }

    async sendNotification(sendNotificationPayload: SendNotificationType): Promise<ApiResponse> {
        return await api(`${this.context.env.NOTIFICATION_WORKER_URL}/notification/send`, 'POST', sendNotificationPayload);
    }

    async makePayment(paymentPayload: PaymentMethod): Promise<ApiResponse> {
        return await api(`${this.context.env.PAYMENT_WORKER_URL}/payment`, 'POST', paymentPayload);
    }

    async getOneCustomer(id: string): Promise<ApiResponse> {
        return await api(`${this.context.env.SUBSCRIPTION_WORKER_URL}/customer/one/${id}`, 'GET');
    }

    async getOneSubscription(id: string): Promise<ApiResponse> {
        return await api(`${this.context.env.SUBSCRIPTION_WORKER_URL}/subscription/one/${id}`, 'GET');
    }
}
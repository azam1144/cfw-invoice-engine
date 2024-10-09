export type SendNotificationType = {
    customer_id: string,
    invoice_id: string,
    payment_id?: string,
    content: string,
}
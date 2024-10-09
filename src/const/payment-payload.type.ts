export type PaymentMethod = {
    amount: number,
    customer_id: string,
    invoice_id: string,
    payment_method?: string,
    payment_date: string,
}
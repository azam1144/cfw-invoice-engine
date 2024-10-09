import {z} from "zod";
import {InvoiceSchema} from "../entities/invoice.entity";
export const PartialInvoiceSchema = InvoiceSchema.partial();

export const UpdateSchemaValidator = {
    tags: ["Invoices"],
    summary: "Get a single Invoice by ID",
    request: {
        params: z.object({
            id: z.string({ description: "Invoice ID" }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: PartialInvoiceSchema,
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Returns a single invoice if found",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        result: z.object({
                            data: InvoiceSchema,
                        }),
                    }),
                },
            },
        },
        "404": {
            description: "Invoice not found",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        error: z.string(),
                    }),
                },
            },
        },
    },
};
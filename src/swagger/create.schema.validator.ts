import {z} from "zod";
import {Bool} from "chanfana";
import {CreateInvoiceSchema, InvoiceSchema} from "../entities/invoice.entity";

export const createSchemaValidator = {
    tags: ["Invoices"],
    summary: "CreateService a new Invoice",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateInvoiceSchema,
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Returns the created Invoice",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: InvoiceSchema,
                        }),
                    }),
                },
            },
        },
    },
};
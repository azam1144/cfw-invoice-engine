import {z} from "zod";
import {Bool, Str} from "chanfana";
import {InvoiceSchema} from "../entities/invoice.entity";

export const OneSchemaValidator = {
    tags: ["Invoices"],
    summary: "Get One Invoice details",
    request: {
        params: z.object({
            id: Str({ description: "Invoice ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns a Invoice details",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: InvoiceSchema.array(),
                        })
                    }),
                },
            },
        },
    },
};
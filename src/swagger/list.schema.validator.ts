import {z} from "zod";
import {Bool, Num} from "chanfana";
import {InvoiceSchema} from "../entities/invoice.entity";

export const listSchemaValidator = {
    tags: ["Invoices"],
    summary: "ListService Invoices",
    request: {
        query: z.object({
            page: Num({
                description: "Page number",
                default: 1,
                required: false,
                example: 1,
            }),
        }),
    },
    responses: {
        "200": {
            description: "Returns a list of Invoices",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: InvoiceSchema.array(),
                        }),
                        pagination: z.object({
                            currentPage: z.number(),
                            totalPages: z.number(),
                            totalCount: z.number(),
                        }),
                    }),
                },
            },
        },
    },
};
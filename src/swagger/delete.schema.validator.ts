import {z} from "zod";
import {Bool, Str} from "chanfana";
import {InvoiceSchema} from "../entities/invoice.entity";

export const DeleteSchemaValidator = {
    tags: ["Invoices"],
    summary: "DeleteService a Invoice",
    request: {
        params: z.object({
            id: Str({ description: "Invoice ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns if the Invoice was deleted successfully",
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
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { OneInvoiceService } from "./services/one.service";
import { ListAllInvoice } from "./services/list.service";
import { GenerateInvoice } from "./services/create.service";
import { DeleteInvoiceService } from "./services/delete.service";
import { UpdateInvoiceService } from "./services/update.service";
import { InvoiceByCustomerService } from "./services/customer-invoices.service";
import { StaticTypesService } from "./services/static-types.service";

const app = new Hono();
const openapi = fromHono(app, {
	docs_url: "/",
});

openapi.get("/api/v0.1/invoice/static-enums", StaticTypesService);
openapi.get("/api/v0.1/invoice", ListAllInvoice);
openapi.post("/api/v0.1/invoice/create", GenerateInvoice);
openapi.get("/api/v0.1/invoice/one/:id", OneInvoiceService);
openapi.patch("/api/v0.1/invoice/:id", UpdateInvoiceService);
openapi.delete("/api/v0.1/invoice/:id", DeleteInvoiceService);

openapi.get("/api/v0.1/invoice/customer/:customer_id", InvoiceByCustomerService);

export default app

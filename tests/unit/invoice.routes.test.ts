import { Hono } from 'hono';
import { fromHono } from 'chanfana';
import { ListAllInvoice } from '../../src/services/list.service'; // Adjust the path as necessary
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockEnv = {
    INVOICE_KV: {
        list: vi.fn(),
        get: vi.fn(),
    },
};

const app = new Hono();
const openapi = fromHono(app, {
    docs_url: "/",
});

// Pass the environment into the service
openapi.get("/api/v0.1/invoice", ListAllInvoice);

describe('ListAllInvoice Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return a list of invoices with pagination', async () => {
        mockEnv.INVOICE_KV.list.mockResolvedValue({
            keys: [{ name: 'invoice1' }, { name: 'invoice2' }, { name: 'invoice3' }],
        });

        // Mock the get method as needed

        const request = new Request('https://example.com/api/v0.1/invoice?page=1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const response = await app.fetch(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
            success: true,
            result: {
                data: [
                    { id: 1, amount: 100 },
                    { id: 2, amount: 200 },
                    { id: 3, amount: 300 },
                ],
            },
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalCount: 3,
            },
        });
    });

    it('should handle empty invoice list', async () => {
        mockEnv.INVOICE_KV.list.mockResolvedValue({ keys: [] });

        const request = new Request('https://example.com/api/v0.1/invoice?page=1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const response = await app.fetch(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
            success: true,
            result: {
                data: [],
            },
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
            },
        });
    });
});
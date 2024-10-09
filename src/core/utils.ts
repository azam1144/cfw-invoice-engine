import moment from "moment/moment";

export const pagination = (page: number, keysLength: number): { totalPages: number; startIndex: number; endIndex: number } => {
    const pageSize = 10; // Number of results per page

    const totalPages = Math.ceil(keysLength / pageSize);
    const startIndex = (page === 1 ? page : page * pageSize) - 1;
    const endIndex = Math.min(startIndex + pageSize, keysLength);
    return { totalPages, startIndex, endIndex };
}

export const getPage = (page: any): number => {
    return typeof page !== 'number' || !page || page < 1 ? 1 : page;
}

export const getDateOnly = (timestamp: string): string => {
    return moment(timestamp).format('YYYY-MM-DD')
}

export const stringToBoolean = (value: string): boolean => value && value.toLowerCase() === 'true';

export const api = async (route: string, method: string, body?: any): Promise<ApiResponse> => {
    const reqBody: RequestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        reqBody['body'] = JSON.stringify(body);
    }
    console.log('route: ', route);
    console.log('reqBody: ', reqBody);
    const response = await fetch(route, reqBody);
    console.log('response: ', response);

    if (!response.ok) {
        return { success: false, message: `HTTP error! status: ${response.status}`, code: response.status };
    }

    return response.json();
}

interface RequestOptions {
    method: string;
    headers: {
        'Content-Type': string;
    };
    body?: string; // Make body optional, since it may not always be present
}

export const serializeResponse = (response: ApiResponse): any => {
    if (response.result && response.result.data) {
        return response.result.data;
    }
    return null;
}

export interface ApiResponse {
    success: boolean;
    result?: {
        data: object
    },
    message?: string,
    code?: number,
}
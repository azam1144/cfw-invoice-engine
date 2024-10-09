## Overview

The Billing Engine Worker is tasked with generating invoices for customers based on their subscription plans. It handles invoicing logic and can be triggered by both HTTP requests and scheduled events.

## Features

- Automatically generate invoices at the end of each billing cycle.
- Support for prorated billing during mid-cycle plan changes.

## Setup

1. Clone the repository:
   ```bash  
   git clone https://github.com/azam1144/cfw-invoice-engine.git  
   cd subscription  

2. Install dependencies:
   ```bash
   npm install

## Environment Configuration Variables
Set the following environment variables in your wrangler.toml file or through the Cloudflare dashboard:

INVOICE_WORKER_URL: URL to the Billing Engine Worker.

1. Variables and Secrets:
   - SUBSCRIPTION_WORKER_URL: URL to the Subscription Worker.
   - PAYMENT_WORKER_URL: URL to the Payment Worker.
   - NOTIFICATION_WORKER_URL: URL to the Notification Worker.

2. KV Namespace Binding:
     INVOICE_KV

2. Example for development:
   - WORKER_URL=http://<your-domain.com>:<port>/

## How to Run Locally
1. To run the worker locally, use:
    ```bash
    npm run dev

## How to Run Locally
1. To run the worker locally, use:
   ```bash
   npm run dev  

This will start the worker on a local server. You can test it using a tool like Postman or curl.


## How to Deploy on Production
1. To deploy the worker to production, run:
   ```bash
   npm run deploy  

Ensure you have configured your environment variables correctly in the Cloudflare dashboard.


## API Documentation
Below is the domain where you can see API Docs

https://subscription.azam-arid1144.workers.dev/
   
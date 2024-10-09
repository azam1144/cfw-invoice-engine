const { Miniflare } = require('miniflare');
const { ScheduledEvent } = require('@cloudflare/workers-types');

// Simulating a ScheduledEvent with necessary properties
const simulateEvent = {
    type: 'cron',
    scheduledTime: Date.now(),
    cron: '*/30 * * * *', // Example cron expression
    noRetry: false,
    waitUntil: (promise) => promise,
    eventPhase: 'none',
};

async function testScheduledFunction() {
    const mf = new Miniflare({
        script: './src/index.js', // Your Worker entry point
        // Add any KV storage or environment variables if needed
    });

    // Manually invoke the scheduled function with the simulated event
    try {
        await mf.dispatchScheduled(simulateEvent);
        console.log('Scheduled function executed successfully.');
    } catch (error) {
        console.error('Error executing scheduled function:', error);
    }
}

// Run the test
testScheduledFunction().catch(error => console.error('Unhandled error during testing:', error));
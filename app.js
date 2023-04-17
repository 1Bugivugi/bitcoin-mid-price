// Import required libraries
const express = require('express');
const axios = require('axios');

// Initialize Express app
const app = express();
const port = process.env.HTTP_PORT || 3333;

// Get environment variables for update frequency, service commission, and HTTP port
const UPDATE_FREQUENCY = process.env.UPDATE_FREQUENCY || 10;
const SERVICE_COMMISSION = process.env.SERVICE_COMMISSION || 0.0001;

// Define Binance API endpoint for getting ticker data
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT';

// Define function to calculate mid price with service commission
const calculateMidPrice = (bidPrice, askPrice, commission) => {
    const bidPriceWithCommission = parseFloat(bidPrice) * (1 + parseFloat(commission));
    const askPriceWithCommission = parseFloat(askPrice) * (1 + parseFloat(commission));

    return (bidPriceWithCommission + askPriceWithCommission) / 2;
};

// Define endpoint for getting current price with service commission
app.get('/price', async (req, res) => {
    try {
        // Send request to Binance API to get ticker data
        const response = await axios.get(BINANCE_API_URL);
        const tickerData = response.data;

        // Extract bid and ask prices from ticker data
        const bidPrice = tickerData.bidPrice;
        const askPrice = tickerData.askPrice;

        // Calculate mid price with service commission
        const midPrice = calculateMidPrice(bidPrice, askPrice, SERVICE_COMMISSION);

        // Return mid price as JSON response
        res.json({ midPrice, bidPrice, askPrice });
    } catch (error) {
        // Return error message as JSON response if any error occurs
        res.status(500).json({ error: error.message });
    }
});

// Start Express app
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

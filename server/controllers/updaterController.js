const WebSocket = require('ws');
const Order = require('../models/orders');
const wss = new WebSocket.Server({ port: 8000 });

const sendUpdates = async (ws) => {
    const intervals = [
        { count: 10, delay: 1000 },
        { count: 30, delay: 2000 },
        { count: 70, delay: 3000 },
        { count: 100, delay: 5000 },
    ];

    let currentInterval = 0;
    let sentUpdates = 0;
    let totalOrdersFetched = 0;

    const sendBatch = async () => {
        if (currentInterval >= intervals.length) return;

        const { count, delay } = intervals[currentInterval];

        try {
            const sort = { '_id': -1 };
            const orders = await Order.find().limit(count).skip(sentUpdates).sort(sort).exec();
            sentUpdates = count;
            console.log(orders)
            if (!orders.length) return;

            console.log(orders.length);

            orders.forEach(order => {
                const message = JSON.stringify(order);
                ws.send(message);
            });


            totalOrdersFetched += orders.length;

            if (orders.length < count) {
                return;
            } else if (sentUpdates >= count) {
                currentInterval++;
            }

            setTimeout(sendBatch, delay);

        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    sendBatch();
};



wss.on('connection', (ws) => {
    console.log('Client connected');
    sendUpdates(ws);

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = wss;

const wsUrl = "ws://localhost:8000";
let ws;
const orders = {};
const existingOrders = {};

document.getElementById("connectBtn").addEventListener("click", () => {

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        addMessage("Connected to the WebSocket server");
        ws.send("Hello from the client!");

        initializeExistingOrders();
    };

    ws.onmessage = (event) => {
        const order = JSON.parse(event.data);

        function determineAction(order) {
            if (!existingOrders[order.appOrderID]) {
                if (order.priceType === "MKT" && order.status === "complete")
                    return { AppOrderID: order.appOrderID, action: "placeOrder" };
                if (order.priceType === "LMT" && order.status === "open")
                    return { AppOrderID: order.appOrderID, action: "placeOrder" };
                if (
                    (order.priceType === "SL-LMT" || order.priceType === "SL-MKT") &&
                    order.status === "pending"
                )
                    return { AppOrderID: order.appOrderID, action: "placeOrder" };
            } else {
                if (order.priceType === "MKT" && order.status === "complete")
                    return { AppOrderID: order.appOrderID, action: "modifyOrder" };
                if (order.priceType === "LMT" && order.status === "open")
                    return { AppOrderID: order.appOrderID, action: "modifyOrder" };
                if (
                    (order.priceType === "SL-LMT" || order.priceType === "SL-MKT") &&
                    order.status === "pending"
                )
                    return { AppOrderID: order.appOrderID, action: "modifyOrder" };
            }
            if (
                order.priceType === "LMT" ||
                order.priceType === "SL-LMT" ||
                (order.priceType === "SL-MKT" && order.status === "cancelled")
            )
                return { AppOrderID: order.appOrderID, action: "cancelOrder" };
            return "unknown";
        }

        const eventOrder = determineAction(order);

        console.log(eventOrder)
        if (eventOrder.AppOrderID && eventOrder.action) {
            existingOrders[eventOrder.AppOrderID] = eventOrder.action;
            updateTable();
        }
    };

    ws.onclose = () => {
        addMessage("Disconnected from the WebSocket server");
    };

    ws.onerror = (error) => {
        addMessage("WebSocket error: " + error.message);
    };
});

function initializeExistingOrders() {
    const rows = document.querySelectorAll("#ordersTable tbody tr");
    rows.forEach(row => {
        const orderID = row.cells[0].textContent;
        const status = row.cells[1].textContent;
        existingOrders[orderID] = status;
    });
}

function updateTable() {
    const tableBody = document.querySelector("#ordersTable tbody");
    tableBody.innerHTML = "";
    Object.entries(existingOrders).forEach(([orderID, status]) => {
        const row = document.createElement("tr");
        const cellID = document.createElement("td");
        cellID.textContent = orderID;
        const cellStatus = document.createElement("td");
        cellStatus.textContent = status;
        row.appendChild(cellID);
        row.appendChild(cellStatus);
        tableBody.appendChild(row);
    });
}

function addMessage(message) {
    const messageDiv = document.getElementById("messages");
    const newMessage = document.createElement("p");
    newMessage.textContent = message;
    messageDiv.appendChild(newMessage);
}

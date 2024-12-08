const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');

// Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MQTT Configuration
const MQTT_BROKER = 'mqtt://IP'; // Replace with your broker
const MQTT_TOPIC = 'esp32/temperature';

let latestMessage = 'No data received yet'; // Store the latest MQTT message

// MQTT Client Setup
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
        } else {
            console.error('Failed to subscribe:', err);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`Received message: ${message.toString()} on topic: ${topic}`);
    if (topic === MQTT_TOPIC) {
        latestMessage = message.toString();
        io.emit('mqttMessage', latestMessage); // Send message to connected clients
    }
});

// Serve static files
app.use(express.static('public'));

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

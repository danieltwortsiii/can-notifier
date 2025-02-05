// publisher.js
const mqtt = require('mqtt');

// MQTT broker configuration
const hiveMQConfig = {
    host: process.env.HIVEMQ_HOST || '9ef50ac894a64630ab0c5fbe4b888474.s1.eu.hivemq.cloud',
    port: parseInt(process.env.HIVEMQ_PORT) || 8883,
    protocol: 'mqtts',
    username: process.env.HIVEMQ_USERNAME || 'nathikazad',
    password: process.env.HIVEMQ_PASSWORD
};

// Array of alarm messages
const alarmMessages = [
    "Error Message:SENDTO:TEST1@EMAIL.COM,DAN.WORTS@GMAIL.COM,9733030123,1234567890,DAN.WORTS@YAHOO.COM",
    "Another Error Message:SENDTO:TEST1@EMAIL.COM,DAN.WORTS@GMAIL.COM,9733030123,1234567890,DAN.WORTS@YAHOO.COM",
    "Dry bulb sensor error:SENDTO:TEST1@EMAIL.COM,DAN.WORTS@GMAIL.COM,9733030123,1234567890,DAN.WORTS@YAHOO.COM",
    "Chiller Error:SENDTO:TEST1@EMAIL.COM,DAN.WORTS@GMAIL.COM,9733030123,1234567890,DAN.WORTS@YAHOO.COM",
    "CO2 Alarm:SENDTO:TEST1@EMAIL.COM,DAN.WORTS@GMAIL.COM,9733030123,1234567890,DAN.WORTS@YAHOO.COM",
    "CO2 Alarm:SENDTO:TEST1@EMAIL.COM,DAN.WORTS@GMAIL.COM,9733030123,1234567890,DAN.WORTS@YAHOO.COM"
];

const topic = 'CommercialSystemAlarms/Cannatrol Flower Room';

// Connect to MQTT broker
const client = mqtt.connect(hiveMQConfig);

client.on('connect', () => {
    console.log('Connected to HiveMQ broker');
    
    // Publish messages with a delay between each
    let messageIndex = 0;
    
    const publishMessage = () => {
        if (messageIndex < alarmMessages.length) {
            const message = alarmMessages[messageIndex];
            
            client.publish(topic, message, { qos: 0 }, (error) => {
                if (error) {
                    console.error('Error publishing message:', error);
                } else {
                    console.log(`Published message ${messageIndex + 1}:`, message);
                }
            });
            
            messageIndex++;
            // Wait 2 seconds before publishing next message
            setTimeout(publishMessage, 2000);
        } else {
            console.log('All messages published');
            client.end();
            process.exit(0);
        }
    };
    
    // Start publishing messages
    publishMessage();
});

client.on('error', (error) => {
    console.error('MQTT Error:', error);
    process.exit(1);
});
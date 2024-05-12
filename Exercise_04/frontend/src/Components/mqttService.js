import mqtt from "mqtt";

const mqttBroker =
  "wss://2956256e0a20402f951dc90fe3f5d944.s1.eu.hivemq.cloud:8884/mqtt";
const mqttClient = mqtt.connect(mqttBroker, {
  clientId: "web-client",
  username: "exercise_five",
  password: "Abc123456",
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("esp8266/client1");
  mqttClient.subscribe("esp8266/client2");
});

function sendMessage(topic, message) {
  mqttClient.publish(topic, message);
}

export { sendMessage };

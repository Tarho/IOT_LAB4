#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "WiFi 35";
const char* password = "doipassroi";

const char* mqtt_server = "2956256e0a20402f951dc90fe3f5d944.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "exercise_five";
const char* mqtt_password = "Abc123456";
const char* server = "http://192.168.1.10:8080/api/addTempurateSenSorValue";

WiFiClientSecure espClient;
PubSubClient client(espClient);
WiFiClient wificlient;

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

#define DHTPIN D5
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const int led1 = D6;
const int led2 = D7; // Assuming LED is connected to pin D6 on the Wemos board
unsigned long timeDelay = millis();
boolean updateState = 0;

// Define your board ID
const int boardId = 2;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff),HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("esp8266/client1");
      client.subscribe("esp8266/client2");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String incomingMessage = "";
  for(int i=0; i<length;i++) incomingMessage += (char)payload[i];
  Serial.println("Message arrived [" + String(topic) + "]: " + incomingMessage);

  DynamicJsonDocument doc(100);
  DeserializationError error = deserializeJson(doc, incomingMessage);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }

  // Check if the incoming message contains "out" field
  if (doc.containsKey("out")) {
    // Extract the value of the "out" field
    int outValue = doc["out"];
    if (strcmp(topic, "esp8266/client1") == 0) {
      // If the message is for LED1, control LED1
      digitalWrite(led1, outValue == 1 ? HIGH : LOW);
    } else if (strcmp(topic, "esp8266/client2") == 0) {
      // If the message is for LED2, control LED2
      digitalWrite(led2, outValue == 1 ? HIGH : LOW);
    }
    updateState = 1; // Set the flag to indicate that LED state has been updated
  }
}

void publishMessage(const char* topic, String payload, boolean retained) {
  if (client.publish(topic, payload.c_str(), true))
    Serial.println("Message published [" + String(topic) + "]: " + payload);
}

void measureAndSendData() {
   float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  StaticJsonDocument<200> doc;

  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["board_id"] = 2; // Include board ID in the JSON payload
  String payload;

  serializeJson(doc, payload);

  HTTPClient http;

  http.begin(wificlient, server); 
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(payload);

  if (httpResponseCode == 200) {
    String response = http.getString();
    DynamicJsonDocument json(10000);
    deserializeJson(json, response);
    Serial.println(response);
  }
  else {
    Serial.print("Http post request failed, error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  delay(5000);
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  while(!Serial) delay(1);

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
  measureAndSendData();

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (updateState == 1) {
    // Create a JSON message indicating the current state of the LEDs
    DynamicJsonDocument doc(1024);
    doc["led1"] = digitalRead(led1);
    doc["led2"] = digitalRead(led2);
    char mqtt_message[128];
    serializeJson(doc, mqtt_message);
    // Publish the JSON message to the MQTT topic
    publishMessage("esp8266/led", mqtt_message, true);
    updateState = 0; // Reset the flag
  }
}
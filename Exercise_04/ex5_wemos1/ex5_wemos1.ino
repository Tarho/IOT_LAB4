#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <TimeLib.h> // Include TimeLib library for time functions

const char* ssid = "Vux";
const char* password = "tttt18032001";
const char* server = "http://192.168.230.144:8080/api/updateStatus/1";

WiFiClient client;

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

  configTime(2*3600, 0, "pool.ntp.org");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Get current time
    time_t now = time(nullptr);

    // Format current time into a string
    char timeStr[20];
    strftime(timeStr, sizeof(timeStr), "%Y-%m-%d %H:%M:%S", localtime(&now));

    // Create JSON document
    StaticJsonDocument<200> doc;
    doc["status"] = 1;
    doc["date"] = timeStr;

    // Serialize JSON document
    String payload;
    serializeJson(doc, payload);

    // Send HTTP PUT request
    HTTPClient http;
    http.begin(client, server);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.PUT(payload);

    if (httpResponseCode == 200) {
      String response = http.getString();
      DynamicJsonDocument json(10000);
      deserializeJson(json, response);
      
      // Print the JSON response
      serializeJsonPretty(json, Serial);
      Serial.println(); // Add a newline for better readability
    } else {
      Serial.print("HTTP PUT request failed, error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected. Reconnecting...");
    WiFi.reconnect();
  }

  delay(5000); // Delay for 5 seconds before next request
}


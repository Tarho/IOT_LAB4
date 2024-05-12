#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include "DHT.h"

const char* ssid = "WiFi 35";
const char* password = "doipassroi";
const char* server = "http://192.168.1.14:8080/api/addLightSenSorValue";

BH1750 lightMeter(0x23);

WiFiClient client;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  
  lightMeter.begin();

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

void loop() {
  float lightIntensity = lightMeter.readLightLevel();

  StaticJsonDocument<200> doc;

  doc["light"] = lightIntensity;
  String payload;

  serializeJson(doc, payload);

  HTTPClient http;

  http.begin(client, server);
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
  
  delay(60000); 
}

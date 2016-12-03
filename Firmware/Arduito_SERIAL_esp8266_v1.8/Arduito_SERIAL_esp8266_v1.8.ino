// Programmed: 29 Nov 2016

#include <math.h>
int rawAnalogValue;
int correctedAnalogValue;
float celciusTemperature;

#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); // RX, TX

#define gpio 13
#define host_name "192.168.11.103"
#define location "GET /ffms/post.php?data="
#define number_characters "125"
#define ping_response 500


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(1000);

  for (int c = 0; c<=10; c++){
    digitalWrite(gpio,HIGH);
    delay(250);
    digitalWrite(gpio,LOW);
    delay(250);
    }
  
    Serial.println("AT+RST");
    delay(2000);
    String ms = "AT+CWJAP=";
    ms += char(34);
    ms += "LLEON";
    ms += char(34);
    ms += ",";
    ms += char(34);
    ms += "klooid";
    ms += char(34);*/

  delay(5000);
  Serial.print("AT+RST\r\n");
 
}

int contador = 0;

void loop() {

   if(contador == 50) contador = 0;
   else contador++;
   
   enviarData(contador);
}


void enviarData (int data) {
  digitalWrite(gpio,HIGH);
  delay(100);
  String msg = "AT+CIPSTART=";
  String msg2 = "";
  String msg3 = "";
  msg += char(34);
  msg += "TCP";
  msg += char(34);
  msg += ",";
  msg += char(34);;
  msg += host_name;
  msg += char(34);
  msg += ",";
  msg += "80";
  msg += "\r\n";
  Serial.print(msg);
  delay(ping_response);
  msg  = "AT+CIPSEND=";
  msg += number_characters;
  Serial.println(msg);
  delay(ping_response);
  msg2 = location;
  msg2 += data; // Variable a cargar
  msg2 += "\r\n";

  Serial.print(msg2);
  delay(ping_response);
  Serial.print("HTTP/1.1\r\n");
  delay(ping_response);
  msg3 = "host=";
  msg3 += host_name;
  msg3 += "\r\n";
  Serial.print("host=192.168.43.111\r\n");
  delay(ping_response);
  digitalWrite(gpio,LOW);
}




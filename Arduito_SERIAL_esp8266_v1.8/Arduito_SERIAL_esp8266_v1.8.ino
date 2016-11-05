/*
   http://direct.ffer.klooid.net/wifiSensor/postSensors.php?device=CAMARA1_FRESH_B1&A=0&B=0&C=3&D=4&E=5&F=3&type=1

   AT+CIPSTART="TCP","freshdeli.ffer.klooid.net",80
   AT+CIPSEND=125
   GET /modules/libs/postSensors.php?device=CAMARA1_FRESH_B1&A=15&B=0&C=17&D=18&E=19&F=20
   HTTP/1.1
   Host:freshdeli.ffer.klooid.net


   //==============================================================================
   //==============================================================================
   AT+CIPSTART="TCP","192.168.2.104",80M
   AT+CIPSEND=94
   GET /postSensors.php?device=CAMARA1_FRESH_B1&A=0&B=0&C=3&D=4&E=5&F=21
   HTTP/1.1
   Host:192.168.2.104
   //==============================================================================
   //==============================================================================

   //====================================================================================================================================================
   //====================================================================================================================================================
  List of available networks
  AT+CWLAP
  List of credentials for WiFi
  AT+CIFSR

  Connect to CWJAP
  AT+CWJAP="FamiliaArias-NET","estaeslacasadeguela1827"
  AT+CWJAP="JMiPHONE","migue123"
  AT+CWJAP="estudiantes.ie","estudiantes"
  AT+CWJAP="Freshy_Guest","delicios0"
  
  AT+CIPSTART="TCP","api.thingspeak.com",80
  AT+CIPSEND=142
  GET /update?api_key=78W6R55CVCQ4N9NY&field1=020.00&field2=020.00&field3=000.00&field4=000.00&field5=000.00&field6=000.00&field7=000.00
  HTTP/1.1
  Host:api.thingspeak.com
   //====================================================================================================================================================
  AT+CIPSTART="TCP","direct.ffer.klooid.net",80
  AT+CIPSEND=112
  GET /wifiSensor/postSensors.php?device=CAMARA1_FRESH_B1&A=0.00&B=0.00&C=0.00&D=0.00&E=23.00&F=3.00&type=0
  HTTP/1.1
  Host:api.thingspeak.com
   //====================================================================================================================================================
  AT+CIPSTART="TCP","192.168.43.111",80
  AT+CIPSEND=41
  GET /ffms/post.php?data=1
  HTTP/1.1
  Host:api.thingspeak.com
   //====================================================================================================================================================

*/

#include <math.h>
int rawAnalogValue;
int correctedAnalogValue;
float celciusTemperature;

#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); // RX, TX

#define gpio 13
#define default_protocol "TCP"
#define host_name "192.168.0.103"
//#define host_name "api.thingspeak.com"
#define default_port "80"
#define number_characters "125"
#define ping_response 500


void setup() {
  // put your setup code here, to run once:
  mySerial.begin(115200);
  Serial.begin(9600);
  //delay(1000);

  for (int c = 0; c<=10; c++){
    digitalWrite(gpio,HIGH);
    delay(250);
    digitalWrite(gpio,LOW);
    delay(250);
    }
  
  /*
    Serial.println("AT+RST");
    delay(2000);
    String ms = "AT+CWJAP=";
    ms += char(34);
    ms += "FamiliaArias-NET";
    ms += char(34);
    ms += ",";
    ms += char(34);
    ms += "estaeslacasadeguela1827";
    ms += char(34);*/

    
  //delay(15000);

  
  delay(5000);
  mySerial.print("AT+RST\r\n");
 
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
  msg += char(34);
  msg += "TCP";
  msg += char(34);
  msg += ",";
  msg += char(34);
  msg += "192.168.43.111";
  //msg += host_name;
  msg += char(34);
  msg += ",";
  msg += "80";
  msg += "\r\n";
  mySerial.print(msg);
  Serial.print(msg);
  delay(ping_response);
  msg  = "AT+CIPSEND=";
  msg += "41";
  Serial.println(msg);
  mySerial.println(msg);
  delay(ping_response);
  msg2 = "GET /ffms/post.php?data=";
  msg2 += data; // Variable a cargar
  msg2 += "\r\n";


  mySerial.print(msg2);
  Serial.print(msg2);
  delay(ping_response);
  mySerial.print("HTTP/1.1\r\n");
  Serial.print("HTTP/1.1\r\n");
  delay(ping_response);
  mySerial.print("host=192.168.43.111\r\n");
  Serial.print("host=192.168.43.111\r\n");
  delay(ping_response);
  digitalWrite(gpio,LOW);
}




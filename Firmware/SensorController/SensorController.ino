// Programmed: 29 Nov 2016

#include <math.h>

// Parameters for sampling
const int numberOfSamples = 50; // Recommended: 50
const int delayPerSample = 10; // In milliseconds (Recommended: 10)
const int delayPerPackage = 30000; // In milliseconds - Time spent by WiFi to send each group of samples (Recommended: 30 segs)
const int numberOfSensors = 3;

// Parameters for sensors
const long PortCodes[] = {100001,100002,100003}; // Sensor codes // Device = 10000X
const int Threshold = 3000; // Adjusted by Pot

// For sending info through WiFi
#define gpio 13
#define host_name "192.168.11.103"
#define location1 "GET /ffms/post.php?data="
#define location2 "&code="
#define location3 "&status="
#define number_characters "55"
#define ping_response 10

// Parameters for alarm
#define AlarmIndicator 5
#define Beep 4
int timeSending;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(5000);
  Serial.print("AT+RST\r\n");

  // Para los perifericos
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);

  // Tiempos
  // Calculate time to send Each package
   timeSending = (delayPerPackage * 0.333) - numberOfSamples*delayPerSample - 50;

   // Arranque y dejar estabilizar el sensor
   for(int i = 0; i < 10; i++)
   {
      tone(Beep, 500, 500);
      delay(1000); 
   }
 
}

int contador = 0;
unsigned long timer = 0;
float average[] = {0,0,0}; 
double sum[] = {0,0,0};
bool s_status[] = {0,0,0};
bool alarm = false;

void loop() {

   // Acquiring values
   for(int i = 0; i < numberOfSamples; i++)
   {
       for(int j = 0; j< 3; j++)
       {
         sum[j] = sum[j] + readSensor(j);
       }
       delay(delayPerSample);
   }
   // Calculate averages
   for(int i = 0; i < 3; i++)
   {
      average[i] = sum[i] / numberOfSamples;
      sum[i] = 0;
    }
     
   // See status
   for(int i = 0; i < 3; i++)
     if(!s_status[i])
       s_status[i] = average[i] > Threshold;
     else
       alarm = true;
       
   // Send data
//   for(int i = 0; i < 3; i++)
//   {
//      enviarData(average[i], s_status[i], PortCodes[i]);
//      delay(timeSending); 
//   }  

 
   if((millis() - timer) > timeSending)
   {
      enviarData(average[contador], s_status[contador], PortCodes[contador]);
      timer = millis();
      if(contador == 2)
        contador = 0;
      else
        contador++;
   }

   // FALTA CONFIGURAR LA ALARMA
   digitalWrite(AlarmIndicator, alarm);
   if(alarm)
    tone(Beep, 500);
}

// For readSensor function
int rawAnalog;
float voltage;

int readSensor(int sensor)
{
   rawAnalog = analogRead(sensor);
   voltage = rawAnalog * 4.88;
   return voltage;
}

  
void enviarData (int data, int s_status, long code) {
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
  msg2 = location1;
  msg2 += data; // Variable a cargar
  msg2 += location2;
  msg2 += code;
  msg2 += location3;
  msg2 += s_status;
  msg2 += "\r\n";

  Serial.print(msg2);
  delay(ping_response);
  Serial.print("HTTP/1.1\r\n");
  delay(ping_response);
  msg3 = "host=";
  msg3 += host_name;
  msg3 += "\r\n";
  Serial.print(msg3);
  delay(ping_response);
}




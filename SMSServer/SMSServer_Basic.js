// -------------------------------------------------------------------
// Klooid Innovations Costa Rica - 2016
// Code Name: SMS Server
// Date: Dec-13-2016
// Programmer: Luis Leon Vega
// Description: This code allows you to make a SMS server using SIM900
//				and a Orange Pi. However, you can use this with other
//				SIMxxx devices and a RaspberryPi	
// Licence: This code is under GPL licence. You can use	it but you have
//			to invite me a Coca Cola :) Please, don't forget give me
//			an acknowledgement.		
// Hardware required: A computer or embed system. A SIM900 with serial 
//			comm
// Usage: You only have to invoke the function SIM900_SENDSMS(number, message);
// -------------------------------------------------------------------

/**-------------------------**/
/**   Important Parameters  **/
/**-------------------------**/
var Submit = String.fromCharCode(26);
/**-------------------------**/
/**     NodeJS Libraries    **/
/**-------------------------**/
// Serialport - For connecting to SIM900 Module
var SerialPort = require('serialport');
var SIM900 = new SerialPort('/dev/ttyS0', {
	baudRate: 9600
});
// Serialport opening Routine
SIM900.on('open', function() {
  console.log("# SIM900 Port Open");
  SERVER_INIT();
});
/**-------------------------**/
/**     Set up Function     **/
/**-------------------------**/
// Initialization procedure
var DBError = false;
function SERVER_INIT()
{
	console.log("# Starting SIM900..");
	// Start SMS Server
	SIM900_INIT();

}
/**-------------------------**/
/**   SMS Server Routines   **/
/**-------------------------**/
// Serialport reading routine
var echo = false;
SIM900.on('data', function(data){
	if(true)
		console.log('Data: ' + data);
	SIM900_READ(data);
});

// Serialport reading function
var incomingSerial = "";
function SIM900_READ(data)
{
	incomingSerial = data;
}

// Serialport initialization procedure
function SIM900_INIT()
{
	// Cycle
	echo = false; // Debug = true;
	var counter = 0;
	var initSIM = setInterval(function(){
		if(counter == 0)
		{
			console.log("Setting up SIM900..");
			SIM900.write("AT+CMGF=1\r\n");
			counter++;
		}
		else if(counter == 1)
			SIM900.write("AT+CSMP?\r\n");
			counter++;
		else if(counter == 2)
			SIM900.write("AT+CSMP=17,167,0,0\r\n");
			counter++;
		else if(counter == 3)
		{
			if(incomingSerial.indexOf("OK") != -1)
				counter++;
		}
		else if(counter == 5)
		{
			console.log("SIM900's been started..");
			clearInterval(initSIM);
		}
	},3000);
    
}

// SIM900 sending messages
function SIM900_SENDSMS(number, messag)
{
	echo = false;
	var counter = 0;
	var sendSMS = setInterval(function(){
		if(counter == 0)
		{
			// Add number
			console.log("Sending SMS to "+number);
			console.log("Message: "+ messag+"..");
			SIM900.write('AT+CMGS="'+number+'"\r\n');
			counter = 1;
		}
		else if(counter == 1)
		{
			// Wait for console
			if(incomingSerial.indexOf(">") != -1)
			{
				SIM900.write(messag + "\r\n");
				counter = 2;
			}	
			
		}
		else if(counter == 2)
		{
			// Wait for console
			if(incomingSerial.indexOf(">") != -1)
			{
				SIM900.write(Submit);
				counter = 3;
			}	
		}
		else if(counter == 3)
		{
			// 
			if(incomingSerial.indexOf("OK") != -1)
			{
				console.log("SMS Sent...");
				clearInterval(sendSMS);
			}
			if(incomingSerial.indexOf("ERROR") != -1)
			{
				console.log("SMS Fail...");
				clearInterval(sendSMS);
			}
		}
	},3000);
}

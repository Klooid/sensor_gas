/** IMPORTANT PARAMETERS **/
var AdminNumber = "+50684251012"; 
var AdminName = "Luis Leon";
var Submit = String.fromCharCode(26);

/** NodeJS Libraries**/
// Serialport - For connecting to SIM900 Module
var SerialPort = require('serialport');
var SIM900 = new SerialPort('/dev/ttyS0', {
	baudRate: 9600
});

// Serialport opening Routine
SIM900.on('open', function() {
  console.log("SIM900 Port Open");
  SERVER_INIT();
});

// Initialization procedure
function SERVER_INIT()
{
	console.log("Starting SIM900..");
	SIM900_INIT();
	// Debug
	setTimeout(function(){SIM900_SENDSMS(AdminNumber,"Test message successful");},30000);
}

// Serialport reading routine
var echo = false;
SIM900.on('data', function(data){
	if(echo)
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
		}
		else if(counter == 1)
			SIM900.write("AT+CSMP?\r\n");
		else if(counter == 2)
			SIM900.write("AT+CSMP=17,167,0,0\r\n");
		else if(counter == 3)
		{
			console.log("Sending a message to admin..");
			SIM900.write('AT+CMGS="'+AdminNumber+'"\r\n');
		}
		else if(counter == 4)
		{
			SIM900.write("Dear "+AdminName+". The SMS Server has been started correctly.\r\n");
			SIM900.write(Submit);
		}
		else if(counter == 5)
		{
			console.log("SIM900's been started..");
			clearInterval(initSIM);
		}
		counter++;
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
			if(incomingSerial.indexOf(">") != 0)
				counter = 2;
		}
		else if(counter == 2)
		{
			// Write message
			SIM900.write("Dear "+AdminName+". "+messag+". This message was sent by a SMS Server, please don't reply.\r\n");
			SIM900.write(Submit);
				counter = 3;
		}
		else if(counter == 3)
		{
			//
			if(incomingSerial.indexOf("OK") != 0)
			{
				console.log("SMS Sent...");
				clearInterval(sendSMS);
			}
		}
	},3000);
}

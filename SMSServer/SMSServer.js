/** IMPORTANT PARAMETERS **/
var AdminNumber = "+50684251012"; 
var AdminName = "Luis Leon";
var Submit = String.fromCharCode(34);

/** NodeJS Libraries**/
// Serialport - For connecting to SIM900 Module
var SerialPort = require('serialport');
var SIM900 = new SerialPort('/dev/ttyS0', {
	baudRate: 9600
});


SIM900.on('open', function() {
  console.log("SIM900 Port Open");
  SERVER_INIT();
});

// Initialization procedure
function SERVER_INIT()
{
	console.log("Starting SIM900..");
	SIM900_INIT();
}

// Serialport reading routine
SIM900.on('data', function(data){
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
	// Verifying if SIM900 has SMS capability
	SIM900.write("AT+CMGF=1\r\n");
	//while(true)
	//	if(incomingSerial.indexOf("OK") != -1)
	//		break;
	// Verifying if SIM900 has SMS settings right
	SIM900.write("AT+CSMP?\r\n");

	var waiting = true;
	var settingsOK = false;

	setTimeout(function(){ // Retarder
		waiting = false;
	},1000);

	//while(waiting)
	//	if(incomingSerial.indexOf("+CSMP: 17,167,0,0") != -1)
	//		settingsOK = true;
	// Correcting settings
	if(!settingsOK)
		SIM900.write("AT+CSMP=17,167,0,0\r\n");
	//while(true)
	//	if(incomingSerial.indexOf("OK") != -1)
	//		break;
	// Sending message to Admin
	console.log("Sending a message to admin..");
	SIM900.write("AT+CMGS="+AdminNumber+"\r\n");
	//while(true)
	//	if(incomingSerial.indexOf(">") != -1)
	//		break;
	SIM900.write("Dear "+AdminName+". The SMS Server has been initialized correctly."+Submit);
    console.log("SIM900's been started..");
}


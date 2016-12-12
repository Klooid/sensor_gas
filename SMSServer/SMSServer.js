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
	// Cycle
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
		}
		else if(counter == 5)
		{
			SIM900.write(Submit);
			console.log("SIM900's been started..");
			clearInterval(initSIM);
		}
		counter++;
	},3000);
	
	
    
}


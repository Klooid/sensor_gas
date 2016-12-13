// -------------------------------------------------------------------
// Klooid Innovations Costa Rica - 2016
// Project: FFMS - SafetyApp
// Code Name: SMS Server
// Date: Dec-12-2016
// Programmer: Luis Leon Vega
// Description: This code allows you to make a SMS server using SIM900
//				and a Orange Pi. However, you can use this with other
//				SIMxxx devices and a RaspberryPi	
// Licence: This code is under GPL licence. You can use	it but you have
//			to invite me a Coca Cola :) Please, don't forget give me
//			an acknowledgement.		
// -------------------------------------------------------------------

/**-------------------------**/
/**   Important Parameters  **/
/**-------------------------**/
var AdminNumber = "+50684251012"; 
var AdminName = "Luis Leon";
var Submit = String.fromCharCode(26);
var MySQLServerFFMS = '178.32.221.218';
var MySQLUserFFMS = '';
var MySQLPasswordFFMS = '';
var MySQLDBFFMS = '';
/**-------------------------**/
/**     NodeJS Libraries    **/
/**-------------------------**/
// Serialport - For connecting to SIM900 Module
var SerialPort = require('serialport');
var SIM900 = new SerialPort('/dev/ttyS0', {
	baudRate: 9600
});
// MySQL - For connecting to FFMS Database
var mysql      = require('mysql');
var FFMSDB = mysql.createConnection({
  host     : MySQLServerFFMS,
  user     : MySQLUserFFMS,
  password : MySQLPasswordFFMS,
  database : MySQLDBFFMS
});
// Serialport opening Routine
SIM900.on('open', function() {
  console.log("SIM900 Port Open");
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
	// Start MySQL Connection
	FFMSDB.connect(function(err) {
	  if (err) {
	    console.error('Error in MySQL Connection: ' + err.stack);
	    DBError = true;
	    return;
	  }
	  console.log('# Connected to DB successfully');
	});
	// Start MySQL Routine
	if(!DBError) startAlerting();
	// Debug
	setTimeout(function(){SIM900_SENDSMS(AdminNumber,"Test message successful", AdminName);},30000);
}
/**-------------------------**/
/**   SMS Server Routines   **/
/**-------------------------**/
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
function SIM900_SENDSMS(number, messag, name)
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
			SIM900.write("Estimado(a) "+name+". "+messag+". Este mensaje fue enviado por un servidor SMS, por favor, no responder.\r\n");
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
/**-------------------------**/
/**   SQL Client Routines   **/
/**-------------------------**/
// Read SQL Function
function READ_SQL(SQLConnection, Table, Criteria, Order, OrderCriteria)
{
	connection.query('SELECT * FROM '+ mysql.escape(Table) + ' WHERE ' + mysql.escape(Criteria) + 'ORDER BY ' + mysql.escape(OrderCriteria) + ' ' + mysql.escape(Order), function(err, rows, fields) {
  	if (err) throw err;
  		return rows;
	});
}
/**-------------------------**/
/**    Alerting Routines    **/
/**-------------------------**/
var AlertsFFMS = [];
// Main Routine
function startAlerting()
{
	console.log("# Monitoring started...");
	setInterval(function(){CheckAllDevices()},5000);
}
// Checking agroupation
function CheckAllDevices() // Main Function for ReadAllDevices
{
	// Put here all systems those have to be monitored
	ReadAllDevices_FFMS();
}
// SafetyApp Routine
function CheckAllDevices_FFMS()
{
	// Acquire all alerts
	var serials_idAlerted = [];
	var devicesParams = READ_SQL(FFMSDB, 'controls', 'status = 1', 'ASC', 'serial_id');
	if(devicesParams.lenght != 0)
		// Register alerts
		for(var i = 0; i < devicesParams.lenght; i++)
		{
			var id = devicesParams[i].serial_id;
			// Put in view
			serials_idAlerted.push(id);
			// Verify if alert wasn't declared
			if(AlertsFFMS.indexOf(id) != -1)
				// New alert
				SendAlert_FFMS(id, devicesParams.location, devicesParams.owner_user, devicesParams.type);
		}
	// Verify if there is an alert attempted
	for(var i = 0; i < AlertsFFMS.lenght; i++)
	{
		// Quit elements attempted
		if(serials_idAlerted.indexOf(AlertsFFMS[i]) == -1)
			AlertsFFMS.splice(i,1);
	}
	
}
// FFMS Sending alerts
function SendAlert_FFMS(id, location, owner, type)
{
	// Push into AlertsFFMS
	AlertsFFMS.push(id);
	// Get information about owner
	var user = READ_SQL(FFMSDB, 'users', 'user_id = ' + owner, 'ASC', 'user_id');
	if(user.lenght != 0)
	{
		var fullname = user[0].fullname;
		var phone = user[0].phone;
	}
	else
	{
		var fullname = "undefined";
		var phone = "undefined";
	}
	// Get information about type
	var typeTable = READ_SQL(FFMSDB, 'type_controls', 'id = ' + type, 'ASC', 'id');
	if(typeTable.lenght != 0)
		var descriptionType = typeTable[0].description;
	else
		var descriptionType = "undefined";
	// Send message
	var msg = 'Uno de los '+descriptionType + ', ha alertado de una emergencia en '+location+'. Se pide tomar en cuenta acatar este mensaje de forma inmediata para evitar una emergencia mayor.';
	if(phone == "undefined")
		console.log("Error: There is no number to message");
	else
		SIM900_SENDSMS(phone, msg, fullname);
}


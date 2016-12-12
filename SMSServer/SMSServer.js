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
var MySQLServerFFMS = '';
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
	setTimeout(function(){
		if(!DBError) startAlerting();
	}, 30000);
	// Debug
	//setTimeout(function(){SIM900_SENDSMS(AdminNumber,"Test message successful", AdminName);},30000);
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
function SIM900_SENDSMS(number, messag, fname)
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
			// Write message
			SIM900.write("Sr(a) "+fname+". \r\n");
			counter = 2;
		}
		else if(counter == 2)
		{
			// Wait for console
			if(incomingSerial.indexOf(">") != -1)
			{
				SIM900.write("\r\n"+ messag + ". \r\n At: SafetyApp");
				counter = 3;
			}	
		}
		else if(counter == 3)
		{
			// Wait for console
			if(incomingSerial.indexOf(">") != -1)
			{
				SIM900.write(Submit);
				counter = 4;
			}	
		}
		else if(counter == 4)
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
/**-------------------------**/
/**   SQL Client Routines   **/
/**-------------------------**/
var sqlRest;
// Read SQL Function
function READ_SQL(SQLConnection, Table, Criteria, Order, OrderCriteria, callback)
{
	var sql = "SELECT * FROM "+ Table + " WHERE " + Criteria + " ORDER BY " + OrderCriteria + " " + Order;
	FFMSDB.query(sql, function(err, rows, fields) {
  	if (err) throw err;
	callback(rows);
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
	CheckAllDevices_FFMS();
}
// SafetyApp Routine
function CheckAllDevices_FFMS()
{
	// Acquire all alerts
	var serials_idAlerted = [];
	var devicesParams = null;
	READ_SQL(FFMSDB,  "controls", "status = 1", "ASC", "serial_id", function(items){
		devicesParams = items;	
		if(devicesParams != undefined)
			// Register alerts
		
				for(var i in devicesParams)
				{
					var id = devicesParams[i].serial_id;
					// Put in view
					serials_idAlerted.push(id);
					// Verify if alert wasn't declared
					if(AlertsFFMS.indexOf(id) == -1)
						// New alert
						SendAlert_FFMS(id, devicesParams[i].location, devicesParams[i].owner_user, devicesParams[i].type);
				}
		
		// Verify if there is an alert attempted
		for(var i in AlertsFFMS)
		{
			// Quit elements attempted
			if(serials_idAlerted.indexOf(AlertsFFMS[i]) == -1)
			{
				console.log("Device "+ AlertsFFMS[i] + " will be removed..");
				AlertsFFMS.splice(i,1);
			}
		}
	
	});
}
// FFMS Sending alerts
function SendAlert_FFMS(id, location, owner, type)
{
	// Push into AlertsFFMS
	console.log("Reported: " + id);
	AlertsFFMS.push(id);
	// Get information about owner
	var fullname;
	var phone;
	READ_SQL(FFMSDB, 'users', 'user_id = ' + owner, 'ASC', 'user_id', function(user){
		if(user.lenght != 0)
		{
			fullname = user[0].fullname;
			phone = user[0].phone;
		}
		else
		{
			fullname = "undefined";
			phone = "undefined";
		}

		// Get information about type
		var descriptionType;
		READ_SQL(FFMSDB, 'type_controls', 'id = ' + type, 'ASC', 'id', function(typeTable){
			if(typeTable.lenght != 0)
				descriptionType = typeTable[0].short_description;
			else
				descriptionType = "undefined";
			
			// Send message
			if(!(phone == undefined || descriptionType == undefined || fullname == undefined))
			{
				var msg = 'Los '+descriptionType + ' han emitido alerta en '+location+'.';
				if(phone == "undefined" || phone == undefined)
					console.log("Error: There is no number to message");
				else
					SIM900_SENDSMS(phone, msg, fullname);
			}
		});
	
	});

}


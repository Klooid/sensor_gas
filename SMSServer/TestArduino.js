var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
	baudRate: 9600
});

port.on('data', function(data){
	console.log('Data: ' + data);
});

var status = 'ON';
setInterval(function(){
	if(status == 'ON')
	{
		port.write('OFF');
		status = 'OFF';	
	}
	else
	{
		port.write('ON');
		status = 'ON';	
	}
		
},5000);

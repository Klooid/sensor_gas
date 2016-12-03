<?php 
	
	/*
		CONECTAR AL SERVIDOR MYSQL
	*/

	$server_link = mysqli_connect("localhost", "root", "", "Sensor_Sonido");
	/* cambiar el conjunto de caracteres a utf8 */

	mysqli_set_charset($server_link, "utf8");


	if (mysqli_connect_errno()) {
	    printf("Falló la conexión: %s\n", mysqli_connect_error());
	    exit();
	}

	$query = "SELECT * FROM valor_sensor WHERE 1 ORDER BY id DESC";

	$ValorSensor = 0;

	if ($result = mysqli_query($server_link, $query)) {

		$Contador = 0;
	    while ($row = mysqli_fetch_assoc($result)) {
	        if($Contador == 0)
	        {
	        	$ValorSensor = $row["valor"];
	        	if($ValorSensor == 1)
	        	{
	        		echo "<div class='VerdeCirculo' id='result'>1</div>";
	        	}
	        	elseif($ValorSensor == 2)
	        	{
	        		echo "<div class='AmarilloCirculo' id='result'>1</div>";
	        	}
	        	else
	        	{
	        		echo "<div class='RedCirculo' id='result'>1</div>";
	        	}
	        	$Contador++;

	        }
	    }

	    mysqli_free_result($result);
	}


	mysqli_close($server_link);

	//echo $ValorSensor;


 ?>


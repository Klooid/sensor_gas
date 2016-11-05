<?php 
	
	/*
		CONECTAR AL SERVIDOR MYSQL
	*/

	$server_link = mysqli_connect("localhost", "root", "", "ffms");
	/* cambiar el conjunto de caracteres a utf8 */

	mysqli_set_charset($server_link, "utf8");


	if (mysqli_connect_errno()) {
	    printf("Falló la conexión: %s\n", mysqli_connect_error());
	    exit();
	}

	if(isset($_GET['data']))
	{
		$sql = "INSERT INTO example (data) VALUES (".$_GET['data'].")";

				if (mysqli_query($server_link,$sql)) {
				    echo "DONE";
				} else {
				    echo "FAILED";
				}

		mysqli_close($server_link);

	}
	else
		echo "No hay definicion del parametro valor";
 ?>


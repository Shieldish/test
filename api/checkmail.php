<?php
include_once("config.php");

$Email = $_GET["Email"];

// vérifier si un email existe déjà dans la base
$sql = "SELECT Id, email FROM Users WHERE email='" . mysqli_real_escape_string($mysqli, $Email) . "'";

if ($result = mysqli_query($mysqli, $sql)) {
    $rows = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    http_response_code(404);
}
?>

<?php
include_once("config.php");

$Email = $_GET["Email"];

// vérifier le statut d'activation du compte d'un user par son email
$sql = "SELECT Id, email, Status FROM Users WHERE email='" . mysqli_real_escape_string($mysqli, $Email) . "'";

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

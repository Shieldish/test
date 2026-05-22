<?php
ini_set('display_errors', 0);
error_reporting(0);

//connexion a la base de données mysql
$db_username = getenv('DB_USER') ?: 'id19066703_pfe';
$db_password = getenv('DB_PASSWORD') ?: 'fFrP955!N3?G';
$db_name     = getenv('DB_NAME') ?: 'id19066703_pfe_users';
$db_host     = getenv('DB_HOST') ?: 'localhost';

$mysqli = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($mysqli->connect_error) {
    die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}
?>

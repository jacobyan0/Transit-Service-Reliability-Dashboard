<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "Garfield$1969";
//password="Garfield$1969",
$dbname = "ontime";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
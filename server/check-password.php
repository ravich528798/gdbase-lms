<?php
include './connection.php';
$inputs = json_decode(file_get_contents('php://input'));
$studentID = $inputs->studentID;
$password = $inputs->password;
$query = "SELECT `password` FROM `students` WHERE `studentID` = '$studentID'";
$psAtDB = $db -> query($query) -> fetchAll(PDO::FETCH_ASSOC);
echo json_encode($psAtDB[0]['password'] === sha1($password));
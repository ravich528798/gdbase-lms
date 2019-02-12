<?php
include './connection.php';
$inputs = json_decode(file_get_contents('php://input'));
$studentID = $inputs->studentID;
$firstname = $inputs->firstname;
$lastname = $inputs->lastname;
$username = $inputs->username;
$email = $inputs->email;
$mobile = $inputs->mobile;
$query = "UPDATE `students` SET `firstname`='$firstname',`lastname`='$lastname',`email`='$email',`mobile`='$mobile',`username`='$username' WHERE `studentID` = '$studentID'";
if(execute($db, $query)){
  echo json_encode(true);
}else{
  echo json_encode(false);
}
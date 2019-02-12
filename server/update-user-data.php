<?php
include './connection.php';
$inputs = json_decode(file_get_contents('php://input'));
$studentID = $inputs->studentID;
$userdata = $inputs->userdata;
$query = "UPDATE `students` SET `userdata`='$userdata' WHERE `studentID` = '$studentID'";
if(execute($db, $query)){
  echo json_encode(true);
}else{
  echo json_encode(false);
}
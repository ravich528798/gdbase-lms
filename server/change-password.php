<?php
include './connection.php';
$inputs = json_decode(file_get_contents('php://input'));
$email = $inputs->email;
$password = $inputs->password;
//echo $password;
$query = "UPDATE `students` SET `password` = '".sha1($password)."' WHERE `email` = '$email'";
if(execute($db, $query)){
  echo json_encode("changedSucessfully");
}else{
  echo json_encode("ERROR");
}
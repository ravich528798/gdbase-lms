<?php
include('./connection.php');
$user_data = json_decode(file_get_contents('php://input'));
$query = "INSERT INTO `students`(`firstname`, `lastname`, `email`, `mobile`, `username`, `password`, `usertype`) VALUES ('". $user_data -> firstname ."', '".$user_data -> lastname."', '".$user_data -> email."', '".$user_data -> mobileNumber."','".$user_data -> username."', '".sha1($user_data -> newPassword)."', '".$user_data -> userType."')";
if(execute($db, $query)){
  echo json_encode("ADDED");
}else{
  json_encode(print_r($db -> errorInfo())); 
}
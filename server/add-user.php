<?php
include('./connection.php');
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $user_data = json_decode(file_get_contents('php://input'));
  // $user_data = json_decode('{"firstname":"godwin", "lastname":"vc","email":"alfa.godwin.omega@gmail.com","mobileNumber":"9704323232" ,"username":"godwinvc", "newPassword": "User@123", "userType":"student"}');
  $query = "INSERT INTO `students`(`firstname`, `lastname`, `email`, `mobile`, `username`, `password`, `usertype`) VALUES ('". $user_data -> firstname ."', '".$user_data -> lastname."', '".$user_data -> email."', '".$user_data -> mobileNumber."','".$user_data -> username."', '".sha1($user_data -> newPassword)."', '".$user_data -> userType."')";
    if(execute($db, $query)){
      echo json_encode("ADDED");
    }else{
      json_encode(print_r($db -> errorInfo())); 
    }
}
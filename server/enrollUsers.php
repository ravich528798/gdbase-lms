<?php
  include('./connection.php');
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
  $updatedStudent = true;
  $course_data = json_decode(file_get_contents('php://input'));

  $arr = $course_data -> course_data -> enrolled;
  for($i =0; $i < count($arr); $i++){
    if(gettype($arr[$i]) != 'string'){
      $username = $arr[$i] -> username;
    }else{
      $username = $arr[$i];
    }
    $query = "SELECT * FROM students WHERE username = '$username'";
    $userdata = json_decode($db -> query($query) -> fetchAll(PDO::FETCH_ASSOC)[0]['userdata']);
    if(array_key_exists('enrolled', $userdata)){
      array_push($userdata -> enrolled, $course_data -> course_id);
    }else{
      $userdata -> enrolled = [];
      array_push($userdata -> enrolled, $course_data -> course_id);
    }
    $userdata = json_encode($userdata);
    $updateQuery = "UPDATE `students` SET `userdata`='$userdata' WHERE `username`='$username'";
    if(execute($db, $updateQuery)){
      if($updatedStudent == false){
        $updatedStudent = true;
      }
    }else{
      $updatedStudent = json_encode(print_r($db -> errorInfo())); 
    }
  }

  if($updatedStudent == true){
    $course_data_json = json_encode($course_data -> course_data);
    $updateCourseQuery = "UPDATE `courses` SET `course_data`='$course_data_json' WHERE `course_id`='$course_data->course_id'";
    if(execute($db, $updateCourseQuery)){
      echo json_encode("UPDATED");
    }else{
      echo json_encode(print_r($db -> errorInfo()));
    }
  }else{
    echo "FUCK";
  }
}else{
  echo $_SERVER['REQUEST_METHOD']."<br>";
  $updatedStudent = true;
  $course_data = json_decode('{"course_id":"201810220328585bcd27dacb9a0","course_name":"New Course","course_data":{"description":"","dateCreated":1540171773681,"author":"Godwin VC","enrolled":["Jilali", {"username": "info", "enrolledOn": 1550650786324}]}}');
  $arr = $course_data -> course_data -> enrolled;
  for($i =0; $i < count($arr); $i++){
    if(gettype($arr[$i]) != 'string'){
      $username = $arr[$i] -> username;
    }else{
      $username = $arr[$i];
    }
    $query = "SELECT * FROM students WHERE username = '$username'";
    $userdata = json_decode($db -> query($query) -> fetchAll(PDO::FETCH_ASSOC)[0]['userdata']);
    if(array_key_exists('enrolled', $userdata)){
      array_push($userdata -> enrolled, $course_data -> course_id);
    }else{
      $userdata -> enrolled = [];
      array_push($userdata -> enrolled, $course_data -> course_id);
    }
    $userdata = json_encode($userdata);
    $updateQuery = "UPDATE `students` SET `userdata`='$userdata' WHERE `username`='$username'";
    if(execute($db, $updateQuery)){
      if($updatedStudent == false){
        $updatedStudent = true;
      }
    }else{
      $updatedStudent = json_encode(print_r($db -> errorInfo())); 
    }
  }

  if($updatedStudent == true){
    $course_data_json = json_encode($course_data -> course_data);
    $updateCourseQuery = "UPDATE `courses` SET `course_data`='$course_data_json' WHERE `course_id`='$course_data->course_id'";
    if(execute($db, $updateCourseQuery)){
      echo json_encode("UPDATED");
    }else{
      echo json_encode(print_r($db -> errorInfo()));
    }
  }else{
    echo "FUCK";
  }
  
}
<?php
include('./connection.php');
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $course_data = json_decode(file_get_contents('php://input'));
  // $course_data = json_decode('{"course_id":"201810220204445bcd141c437cf","course_name":"Progress Bar ","course_data":{"description":"<h3>Progress mode</h3><p>The progress-bar supports four modes: determinate, indeterminate, buffer and query.</p><p><br></p><h4>&nbsp;Determinate</h4><p>Operations where the percentage of the operation complete is known should use the determinate indicator.</p>"}}');
  
  $query = "INSERT INTO `courses`(`course_id`, `course_name`, `course_data`) VALUES ('". $course_data -> course_id ."', '".$course_data -> course_name."', '".json_encode($course_data -> course_data)."')";
    if(execute($db, $query)){
      echo json_encode("ADDED");
    }else{
      echo json_encode(print_r($db -> errorInfo())); 
    }
}
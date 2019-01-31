<?php
include('./connection.php');
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $course_data = json_decode(file_get_contents('php://input'));
    $query = "INSERT INTO `courses`(`course_id`, `course_name`, `course_data`) VALUES ('$course_data->course_id', '$course_data->course_name', '$course_data->course_data')";

    if(execute($db, $query)){
      echo json_encode("PUBLISHED");
    }else{
      echo json_encode(print_r($db -> errorInfo()));
    }
}
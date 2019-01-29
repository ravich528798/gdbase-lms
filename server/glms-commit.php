<?php
  include './connection.php';
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $inputs = json_decode(file_get_contents('php://input'));
    $studentID = $inputs -> studentID;
    $courses_data = $inputs -> coursesData;
    // $query = "UPDATE `students` SET `courses_data` = '".$courses_data.""' WHERE `students`.`studentID` = $studentID";
    echo json_encode($studentID);
    // if(execute($db, $query)){
    //     echo json_encode("true");
    // }else{
    //     echo json_encode("false");
    // }
  }
<?php
  include('./connection.php');
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $input = json_decode(file_get_contents('php://input'));
    $course_ids = $input -> ids;
    $allCourses = [];
    for ($i=0; $i < count($course_ids); $i++) { 
      $query = "SELECT * FROM `courses` WHERE `course_id`='$course_ids[$i]'";
      array_push($allCourses,$db -> query($query) -> fetchAll(PDO::FETCH_ASSOC)[0]);
    }
    echo json_encode($allCourses);
  }
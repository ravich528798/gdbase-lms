<?php
  include('./connection.php');
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $updatedStudent = true;
    $student_data = json_decode(file_get_contents('php://input'));
    
    class Student {

      public function __construct($username, $enrolledOn)
      {
          $this->username = $username;
          $this->enrolledOn = $enrolledOn;
      }
    }

    $arr = $student_data -> userdata -> enrolled;
    $username = $student_data -> username;
    $userdata = json_encode($student_data -> userdata);
    $studentID = $student_data -> studentID;
    $current_time = number_format(microtime(true)*1000,0,'.','');

    for($i=0; $i < count($arr); $i++){
      $course_id = $arr[$i];
      $query = "SELECT * FROM `courses` WHERE `course_id`='$course_id'";
      $course = $db -> query($query) -> fetchAll(PDO::FETCH_ASSOC);
      $course_data = json_decode($course[0]['course_data']);
      $enrolled = $course_data -> enrolled;
      $student = new Student($username,$current_time);
      if(is_array($enrolled)){
        array_push($enrolled, $student);
        $course_data -> enrolled = $enrolled;
      }else{
        $course_data -> enrolled = array($student);
      }

      $course_data_stringfy = json_encode($course_data);
      $updateDataQuery = "UPDATE `courses` SET `course_data`='$course_data_stringfy' WHERE `course_id`='$course_id'";
      $dbUpdate = execute($db, $updateDataQuery);
      if($dbUpdate != true){
        echo json_encode($dbUpdate);
        die;
      }
      $updateStudentQuery = "UPDATE `students` SET `userdata`='$userdata' WHERE `studentID`='$studentID'";
      $dbUpdate = execute($db, $updateStudentQuery);
      if($dbUpdate != true){
        echo json_encode($dbUpdate);
        die;
      }
    }
    echo json_encode(true);
  }else{
    $updatedStudent = true;
    $student_data = json_decode('{"studentID":"351","firstname":"Godwin","lastname":"VC","email":"godwin@godwinvc.com","mobile":"0401020304","username":"godwinvc","password":"40430383aa399ef2c3af8ef4232d660fb93b057a","usertype":"admin","token":"godwinvc|5c7cd5bd2738c5c7cd5bd273b05c7cd5bd273b1","userdata":{"enrolled":["201903041205095c7d0665092f6","201901311055265c52c60ef11aa","201902201959265c6da38e066d2","201902281417405c77df74045ff","201903011134385c790abe7d048","201903011535495c794345b6a7f","201903011538045c7943cc59f01","201903011541025c79447ee991c"],"dp":""},"courses_data":null}');
    
    class Student {

      public function __construct($username, $enrolledOn)
      {
          $this->username = $username;
          $this->enrolledOn = $enrolledOn;
      }
    }

    $arr = $student_data -> userdata -> enrolled;
    $username = $student_data -> username;
    $userdata = json_encode($student_data -> userdata);
    $studentID = $student_data -> studentID;
    $current_time = number_format(microtime(true)*1000,0,'.','');

    for($i=0; $i < count($arr); $i++){
      $course_id = $arr[$i];
      $query = "SELECT * FROM `courses` WHERE `course_id`='$course_id'";
      $course = $db -> query($query) -> fetchAll(PDO::FETCH_ASSOC);
      $course_data = json_decode($course[0]['course_data']);
      $enrolled = $course_data -> enrolled;
      $student = new Student($username,$current_time);
      if(is_array($enrolled)){
        array_push($enrolled, $student);
        $course_data -> enrolled = $enrolled;
      }else{
        $course_data -> enrolled = array($student);
      }

      $course_data_stringfy = json_encode($course_data);
      $updateDataQuery = "UPDATE `courses` SET `course_data`='$course_data_stringfy' WHERE `course_id`='$course_id'";
      $dbUpdate = execute($db, $updateDataQuery);
      if($dbUpdate != true){
        echo json_encode($dbUpdate);
        die;
      }
      $updateStudentQuery = "UPDATE `students` SET `userdata`='$userdata' WHERE `studentID`='$studentID'";
      $dbUpdate = execute($db, $updateStudentQuery);
      if($dbUpdate != true){
        echo json_encode($dbUpdate);
        die;
      }
    }
    echo json_encode(true);
  }
<?php
    include('./connection.php');
    include('./delete-folder.php');
    $course_data = json_decode(file_get_contents('php://input'));
    $course_id = $course_data->courseId;
    $query = "DELETE FROM `courses` WHERE `course_id` = '$course_id'";
    if(execute($db, $query)){
        if($course_id){
            deleteFolder($course_id);
            echo json_encode("DELETED");
        }
    }else{
        echo json_encode(print_r($db -> errorInfo()));
    }
?>
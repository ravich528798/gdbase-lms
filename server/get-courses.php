<?php
    include('./connection.php');
    $all_courses = $db -> query("SELECT * FROM courses");
    $all_courses = $all_courses -> fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($all_courses);
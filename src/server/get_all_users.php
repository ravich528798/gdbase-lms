<?php
    include('./connection.php');
    $all_users = $db -> query("SELECT * FROM students");
    $all_users = $all_users -> fetchAll();
    echo json_encode($all_users);
<?php
    include('./connection.php');
    $all_active_users = $db -> query("SELECT * FROM students WHERE token != 'LOGGED_OUT'");
    $all_active_users = $all_active_users -> fetchAll();
    echo json_encode($all_active_users);
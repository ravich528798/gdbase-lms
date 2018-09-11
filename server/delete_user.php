<?php
    include('./connection.php');
    $login_data = json_decode(file_get_contents('php://input'));
    $username = $login_data -> username;
    $query = "DELETE FROM `students` WHERE `username` = '$username'";
    echo execute($db, $query) ? json_encode("DELETED $username") : json_encode('ERROR');
?>
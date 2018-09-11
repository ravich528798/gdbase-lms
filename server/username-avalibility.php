<?php
    include('./connection.php');
    $username_entered = file_get_contents('php://input');
    $allUsers = $db -> query('SELECT username FROM students;');
    $allUsers = $allUsers -> fetchAll();
    $unique = 'null';
    for($i = 0; $i < count($allUsers); $i++){
        if($allUsers[$i]['username'] !== $username_entered){
            $unique = '0';
        }else{
            $unique = '1';
            break;
        }
    }
    echo json_encode($unique);
?>
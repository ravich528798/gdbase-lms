<?php
    include('./connection.php');
    $login_data = json_decode(file_get_contents('php://input'));
    // $login_data = json_decode('{"username":"godwinvc","password":"User@123"}');
    $username = $login_data -> username;
    $password = sha1($login_data -> password);
    $userinfo = $db -> query("SELECT username FROM students WHERE username = '$username' AND password = '$password'");
    $userinfo = $userinfo -> fetchAll();
    if(count($userinfo) == 1){
        $token = $username ."|". uniqid().uniqid().uniqid();
        $q = "UPDATE students SET token = :token WHERE username = :username AND password = :password";
        $query = $db -> prepare($q);
        $execute = $query -> execute(array(
            ":token" => $token,
            ":username" => $username,
            ":password" => $password
        ));
        echo json_encode($token);
    }
    else{
        echo json_encode('ERROR');
    }
?>
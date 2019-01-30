<?php
  include './connection.php';
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $inputs = json_decode(file_get_contents('php://input'));
    $action = $inputs -> action;
    $payload = $inputs -> payload;
    $query = null;
    $query = "SELECT * FROM students WHERE $action = '$payload'";
    echo json_encode($db -> query($query) -> fetchAll(PDO::FETCH_ASSOC));
  }
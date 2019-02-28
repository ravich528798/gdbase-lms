<?php
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $courseID = file_get_contents('php://input');
    $target_path = '../courses/'.$courseID.'.zip';
    if(file_exists($target_path)){
      $zip = new ZipArchive();
      $x = $zip->open($target_path);
      if ($x === true) {
          $zip->extractTo("../courses/".$courseID); // change this to the correct site path
          $zip->close($target_path);
  
          unlink($target_path);
          echo json_encode("EXTRACTED: ".$courseID);
      }else{
        unlink($target_path);
        echo json_encode("Uploaded ZIP file is corrupted. Please try with a new one");
      }

    }else{
      echo json_encode($courseID.'.zip dose not exists');
    }
  }
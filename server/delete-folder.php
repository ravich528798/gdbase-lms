<?php
  function deleteFolder($course_id){
    $dir = dirname(__DIR__).'/courses/'.$course_id;
    $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
    $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
    foreach($files as $file) {
        if ($file->isDir()){
          if (!@rmdir($file->getRealPath())) {
            $error = error_get_last();
        
            if (preg_match('/something/', $error['message'])) {
                return false;
            } elseif (preg_match('/somethingelse/', $error['message'])) {
                return false;
            }
        }
            
        } else {
            unlink($file->getRealPath());
        }
    }
    if (!@rmdir($dir)) {
      $error = error_get_last();
  
      if (preg_match('/something/', $error['message'])) {
          return false;
      } elseif (preg_match('/somethingelse/', $error['message'])) {
          return false;
      }
  }
  return true;
}
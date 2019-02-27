<?php
include 'vendor/autoload.php';

use Dilab\Network\SimpleRequest;
use Dilab\Network\SimpleResponse;
use Dilab\Resumable;

$request = new SimpleRequest();
$response = new SimpleResponse();

$courseID = date("YmdHis")."".uniqid();
$resumable = new Resumable($request, $response);
$resumable->tempFolder = 'temp';
$resumable->uploadFolder = '../courses';
$resumable->setFilename($courseID);
$resumable->process();
$target_path = '../courses/'.$courseID.'.zip';
if($resumable->isUploadComplete()){
    $zip = new ZipArchive();
    $x = $zip->open($target_path);
    if ($x === true) {
        $zip->extractTo("../courses/".$courseID); // change this to the correct site path
        $zip->close($target_path);

        unlink($target_path);
    }
    echo "UPLOADED: ".$courseID;
}
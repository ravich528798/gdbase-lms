<?php
include 'vendor/autoload.php';

use Dilab\Network\SimpleRequest;
use Dilab\Network\SimpleResponse;
use Dilab\Resumable;

$request = new SimpleRequest();
$response = new SimpleResponse();

$courseID = date("YmdHis")."".uniqid();
$resumable = new Resumable($request, $response);
$resumable->tempFolder = '../temp';
$resumable->uploadFolder = '../courses';
$resumable->setFilename($courseID);
$resumable->process();
if($resumable->isUploadComplete()){
    echo "UPLOADED: ".$courseID;
}else{
    echo "FILED: ".$courseID;
}
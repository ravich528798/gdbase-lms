<?php
  ini_set( "display_errors", 0);
  $resourcedir = '../courses/'.file_get_contents('php://input');
  // $resourcedir = '../courses/201810220052595bcd034b0215f';
  if(file_exists($resourcedir.'/imsmanifest.xml')){
    $xml = simplexml_load_file($resourcedir.'/imsmanifest.xml') or die(json_encode("Invalid manifest file"));
    isset($xml['identifier']) or die(json_encode("Identifier is missing in the manifest file"));
    isset($xml['version']) or die(json_encode("Version is missing in the manifest file"));
    isset($xml->resources->resource[0]) or die(json_encode("Resources are not listed in the manifest file"));
    echo json_encode("ValidManifest");
  }else{
    echo json_encode("Manifest file is missing");
  }
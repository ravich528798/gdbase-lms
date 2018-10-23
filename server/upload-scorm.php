<?php
// echo json_encode($_FILES);
error_reporting(E_ALL ^ E_WARNING);
$UPLOAD_ERRORS = ["UNKNOW_ERROR", "UPLOAD_ERR_INI_SIZE", "UPLOAD_ERR_FORM_SIZE", "UPLOAD_ERR_PARTIAL", "UPLOAD_ERR_NO_FILE", "", "UPLOAD_ERR_NO_TMP_DIR", "UPLOAD_ERR_CANT_WRITE", "UPLOAD_ERR_EXTENSION"];
if($_FILES["scormFile"]["name"]) {
	$filename = $_FILES["scormFile"]["name"];
	$source = $_FILES["scormFile"]["tmp_name"];
	$type = $_FILES["scormFile"]["type"];
	$courseID = date("YmdHis")."".uniqid();
	
	$name = explode(".", $filename);
	$accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
	foreach($accepted_types as $mime_type) {
		if($mime_type == $type) {
			$okay = true;
			break;
		} 
	}
	
	$continue = strtolower($name[1]) == 'zip' ? true : false;
	if(!$continue) {
    echo json_encode("NOT_A_ZIP");
    die;
	}
	$destination_path = str_replace('/server/','',getcwd().DIRECTORY_SEPARATOR);
	$target_path = $destination_path."/courses/".$filename;  // change this to the correct site path
	if(move_uploaded_file($source, $target_path)) {
		$zip = new ZipArchive();
		$x = $zip->open($target_path);
		if ($x === true) {
			$zip->extractTo("../courses/".$courseID); // change this to the correct site path
			$zip->close();
	
			unlink($target_path);
		}
		echo json_encode("UPLOADED-".$courseID);
	} else {	
		echo json_encode($_FILES);
	}
}
?>
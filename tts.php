<?php
$dir="audio";
$word=$_SERVER['QUERY_STRING']; 
$file_name=$dir.'/'.$word.'.mp3';
if( !file_exists($file_name) )
{
	$voice = file_get_contents('http://translate.google.com/translate_tts?tl=en&q='.$_SERVER['QUERY_STRING']); 
	$file = fopen($file_name, "w");
	fwrite($file,$voice);
	fclose($file);
}
header('Content-Type: audio/mpeg');
echo file_get_contents($file_name);
?>

<?php 
/*$jarr=array( 
array(
'song_id' =>  1, 
'src'=>'001', 
'name'=>'中国'),
array(
'song_id' =>  2, 
'src'=>'002', 
'name'=>'aaa'),
array(
'song_id' =>  3, 
'src'=>'003', 
'name'=>'bbbb'),
array(
'song_id' =>  4, 
'src'=>'004', 
'name'=>'cccc'),


); 
 */

$mongo = new Mongo();

$collection = $mongo->MusicPlayer->defaultSheet;
$data = $collection->find();
$all = array();
foreach($data as $value){
    array_push($all, array('song_id' => $value["song_id"],'name' => $value["name"], 'src' => $value["src"]));
}

echo JSON($all);
$mongo->close();
function arrayRecursive(&$array, $function, $apply_to_keys_also = false){
    static $recursive_counter = 0;
    if (++$recursive_counter > 1000) {
        die('possible deep recursion attack');
    }
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            arrayRecursive($array[$key], $function, $apply_to_keys_also);
        } else {
            $array[$key] = $function($value);
        }
                                                                      
        if ($apply_to_keys_also && is_string($key)) {
            $new_key = $function($key);
            if ($new_key != $key) {
                $array[$new_key] = $array[$key];
                unset($array[$key]);
            }
        }
    }
    $recursive_counter--;
}

function JSON($array) {
    arrayRecursive($array, 'urlencode', true);
    $json = json_encode($array);
    return urldecode($json);
}                                                                 

//echo JSON($jarr);

/*$length = count($jarr);
for($i = 0; $i < $length; $i ++){
    echo $jarr[$i]["song_id"];
    echo $jarr[$i]["name"];
    echo $jarr[$i]["src"];
}
 */
?>


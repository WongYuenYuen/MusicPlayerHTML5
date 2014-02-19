<?php
$mongo = new Mongo(); // 创建一个mongo
$collection = $mongo->MusicPlayer->defaultSheet; // 选择collectons
$data = Array("song_id" => $_REQUEST["song_id"], "name" => $_REQUEST["name"], "src" => $_REQUEST["src"]); //创建数组存储歌曲数据
echo "Hello";
$collection->insert($data); // 将数组插入到defaultheet 的collections里
echo "inset";
$mongo->close();
?>

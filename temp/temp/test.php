<html>
<body>


</body>
</html>

<?php
$mongo = new Mongo();
$dbs = $mongo->listDBs();
print_r($dbs);
?>

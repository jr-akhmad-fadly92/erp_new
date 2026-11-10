<?php
$dirs = [
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/framework/testing',
    'storage/logs',
];
foreach ($dirs as $d) {
    if (!is_dir($d)) {
        mkdir($d, 0777, true);
    }
}
echo "done\n";

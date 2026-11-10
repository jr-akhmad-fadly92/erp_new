<?php
$m = new mysqli('127.0.0.1', 'root', '', 'erp_backend');
if ($m->connect_error) {
    echo 'ERR ' . $m->connect_error;
    exit(1);
}
$query = 'SELECT id, name, email, company_id, role_id, status FROM users ORDER BY id DESC LIMIT 10';
$result = $m->query($query);
if (! $result) {
    echo 'ERR ' . $m->error;
    exit(1);
}
while ($row = $result->fetch_assoc()) {
    echo json_encode($row) . "\n";
}

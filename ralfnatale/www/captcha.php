<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$max = 9;
$a = random_int(1, $max);
$b = random_int(1, $max);
$operator = '+';

$_SESSION['captcha_answer'] = (string)($a + $b);

echo json_encode([
    'question' => $a . ' ' . $operator . ' ' . $b . ' = ?',
]);

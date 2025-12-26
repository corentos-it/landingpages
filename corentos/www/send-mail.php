<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

// ============================================
// SMTP-KONFIGURATION - HIER ANPASSEN!
// ============================================
$smtp_host     = "smtp.ionos.de";
$smtp_port     = 465;
$smtp_user     = "Ralf.natale@corentos.com";
$smtp_password = '$Ralf#Natale!';
$smtp_secure   = "ssl";

$empfaenger    = "Ralf.natale@corentos.com";
$absender_name = "corentos Webseite";      // Absendername für die E-Mail
// ============================================

function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function get_return_url() {
    $default = 'index.html';
    $allowed = ['index.html', 'index-en.html', 'index-fr.html'];

    if (!isset($_POST['return_url'])) {
        return $default;
    }

    $candidate = clean_input((string)$_POST['return_url']);

    if (in_array($candidate, $allowed, true)) {
        return $candidate;
    }

    return $default;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $return_url = get_return_url();
    
    // Honeypot-Check (Spam-Schutz)
    if (!empty($_POST["website"])) {
        header("Location: " . $return_url . "?status=success");
        exit;
    }

    // Captcha-Validierung (Session-basiert)
    $captcha_answer = isset($_POST["captcha_answer"]) ? clean_input($_POST["captcha_answer"]) : "";
    $expected_captcha = isset($_SESSION['captcha_answer']) ? (string)$_SESSION['captcha_answer'] : "";

    if ($captcha_answer === "" || $expected_captcha === "" || $captcha_answer !== $expected_captcha) {
        header("Location: " . $return_url . "?status=error&msg=" . urlencode("Captcha ist ungültig"));
        exit;
    }
    
    // Felder auslesen
    $name = isset($_POST["name"]) ? clean_input($_POST["name"]) : "";
    $email = isset($_POST["email"]) ? clean_input($_POST["email"]) : "";
    $nachricht = isset($_POST["message"]) ? clean_input($_POST["message"]) : "";
    
    // Validierung
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name ist erforderlich";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Gültige E-Mail ist erforderlich";
    }
    
    if (empty($nachricht)) {
        $errors[] = "Nachricht ist erforderlich";
    }
    
    if (!empty($errors)) {
        header("Location: " . $return_url . "?status=error&msg=" . urlencode(implode(", ", $errors)));
        exit;
    }
    
    // PHPMailer initialisieren
    $mail = new PHPMailer(true);
    
    try {
        // SMTP-Einstellungen
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_user;
        $mail->Password   = $smtp_password;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port       = $smtp_port;
        $mail->CharSet    = 'UTF-8';
        
        // Absender und Empfänger
        $mail->setFrom($smtp_user, $absender_name);
        $mail->addAddress($empfaenger);
        $mail->addReplyTo($email, $name);
        
        // Inhalt
        $mail->isHTML(false);
        $mail->Subject = "Anfrage von " . $name;
        
        $mail_body = "Neue Anfrage von corentos Webseite\n";
        $mail_body .= "========================================\n\n";
        $mail_body .= "Name: " . $name . "\n";
        $mail_body .= "E-Mail: " . $email . "\n\n";
        $mail_body .= "Nachricht:\n";
        $mail_body .= "----------\n";
        $mail_body .= $nachricht . "\n\n";
        $mail_body .= "========================================\n";
        $mail_body .= "Gesendet am: " . date("d.m.Y H:i:s") . "\n";
        
        $mail->Body = $mail_body;
        
        // Senden
        $mail->send();
        unset($_SESSION['captcha_answer']);
        header("Location: " . $return_url . "?status=success");
        
    } catch (Exception $e) {
        // Fehler loggen (optional)
        error_log("Mailer Error: " . $mail->ErrorInfo);
        header("Location: " . $return_url . "?status=error&msg=" . urlencode("E-Mail konnte nicht gesendet werden"));
    }
    exit;
    
} else {
    header("Location: index.html");
    exit;
}
?>

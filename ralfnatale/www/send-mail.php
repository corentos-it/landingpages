<?php
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
$smtp_user     = "kontakt@ralfnatale.com";
$smtp_password = '$Ralf#Natale!2023';
$smtp_secure   = "ssl";

$empfaenger    = "kontakt@ralfnatale.com";
$absender_name = "Landingpage Kontakt";      // Absendername für die E-Mail
// ============================================

function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Honeypot-Check (Spam-Schutz)
    if (!empty($_POST["website"])) {
        header("Location: index.html?status=success");
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
        header("Location: index.html?status=error&msg=" . urlencode(implode(", ", $errors)));
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
        $mail->Subject = "[Landingpage] Anfrage von " . $name;
        
        $mail_body = "Neue Kontaktanfrage von der Landingpage\n";
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
        header("Location: index.html?status=success");
        
    } catch (Exception $e) {
        // Fehler loggen (optional)
        error_log("Mailer Error: " . $mail->ErrorInfo);
        header("Location: index.html?status=error&msg=" . urlencode("E-Mail konnte nicht gesendet werden"));
    }
    exit;
    
} else {
    header("Location: index.html");
    exit;
}
?>

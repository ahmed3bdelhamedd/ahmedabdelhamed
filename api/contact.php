<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON payload"]);
    exit();
}

$name    = isset($data["name"]) ? trim(substr($data["name"], 0, 1000)) : "";
$email   = isset($data["email"]) ? trim(substr($data["email"], 0, 1000)) : "";
$phone   = isset($data["phone"]) ? trim(substr($data["phone"], 0, 1000)) : "";
$message = isset($data["message"]) ? trim(substr($data["message"], 0, 4000)) : "";

if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo json_encode(["error" => "Please complete all required fields."]);
    exit();
}

// Telegram credentials (can be set via environment variable or edited below)
$botToken = getenv("TELEGRAM_BOT_TOKEN") ?: "8995459293:AAEcd6oYg4tKFyj18NcADDhu6JWMiKtLtAQ";
$chatId   = getenv("TELEGRAM_CHAT_ID") ?: "6598326586";

if (empty($botToken) || empty($chatId)) {
    http_response_code(503);
    echo json_encode(["error" => "Telegram delivery is not configured."]);
    exit();
}

$telegramText = "New portfolio message\n\nName: " . $name . "\nEmail: " . $email . "\nPhone: " . $phone . "\n\nMessage:\n" . $message;

$url = "https://api.telegram.org/bot" . $botToken . "/sendMessage";
$payload = json_encode([
    "chat_id" => $chatId,
    "text" => $telegramText
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($httpCode === 200) {
    http_response_code(200);
    echo json_encode(["ok" => true]);
} else {
    http_response_code(502);
    echo json_encode(["error" => "Unable to send message to Telegram at this time."]);
}
?>

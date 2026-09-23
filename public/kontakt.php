<?php
declare(strict_types=1);

// Modtager af beskeder fra kontaktformularen. Ret adressen her.
const MODTAGER = 'dc@zrm.dk';
const RETUR_OK = '/kontakt?sendt=1';
const RETUR_FEJL = '/kontakt?fejl=1';

function retur(string $sti): never {
    header('Location: ' . $sti, true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    retur(RETUR_FEJL);
}

// Honeypot: udfyldt felt betyder bot. Vi svarer som om alt gik godt.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    retur(RETUR_OK);
}

// Formularer udfyldt på under tre sekunder er næsten altid automatiserede.
$tid = (int) ($_POST['tid'] ?? 0);
if ($tid > 0 && (int) round(microtime(true) * 1000) - $tid < 3000) {
    retur(RETUR_OK);
}

$navn = trim((string) ($_POST['navn'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$besked = trim((string) ($_POST['besked'] ?? ''));

if ($navn === '' || $besked === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    retur(RETUR_FEJL);
}

if (mb_strlen($navn) > 120 || mb_strlen($besked) > 5000) {
    retur(RETUR_FEJL);
}

// Header injection: nylinjer i navn eller email må aldrig nå headerne.
if (preg_match('/[\r\n]/', $navn . $email)) {
    retur(RETUR_FEJL);
}

$emne = 'Ny besked fra kontaktformularen';
$krop = "Navn: {$navn}\nEmail: {$email}\n\n{$besked}\n";

$headers = [
    'From: Kontaktformular <' . MODTAGER . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$ok = mail(MODTAGER, '=?UTF-8?B?' . base64_encode($emne) . '?=', $krop, implode("\r\n", $headers));

retur($ok ? RETUR_OK : RETUR_FEJL);

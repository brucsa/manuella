<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// ── Conexão ──────────────────────────────────────────────────
try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=bru35182_manu15;charset=utf8mb4',
        'bru35182_manu15_user',
        'BruTeAmo',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); exit;
}

// ── Criar tabelas se não existirem ───────────────────────────
$pdo->exec("
CREATE TABLE IF NOT EXISTS invites (
    id VARCHAR(20) PRIMARY KEY,
    note TEXT,
    confirmed_at BIGINT DEFAULT 0,
    created_at BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invite_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invite_id VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    status ENUM('pending','yes','no') DEFAULT 'pending',
    faixa ENUM('pagante','livre') DEFAULT 'pagante',
    sort_order INT DEFAULT 0,
    FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS gifts (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    kind ENUM('link','pix') DEFAULT 'link',
    value TEXT,
    claimed_by VARCHAR(200) DEFAULT '',
    created_at BIGINT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    created_at BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// ── Helpers ───────────────────────────────────────────────────
function nowMs() { return (int)(microtime(true) * 1000); }
function uid()   { return substr(bin2hex(random_bytes(4)), 0, 7); }

function getAllData($pdo) {
    // Convidados
    $invites = [];
    foreach ($pdo->query("SELECT * FROM invites ORDER BY created_at DESC")->fetchAll() as $row) {
        $s = $pdo->prepare("SELECT name, status, faixa FROM invite_members WHERE invite_id=? ORDER BY sort_order");
        $s->execute([$row['id']]);
        $invites[] = [
            'id'          => $row['id'],
            'note'        => $row['note'] ?? '',
            'confirmedAt' => (int)$row['confirmed_at'],
            'at'          => (int)$row['created_at'],
            'members'     => $s->fetchAll()
        ];
    }

    // Presentes
    $gifts = [];
    foreach ($pdo->query("SELECT * FROM gifts ORDER BY created_at")->fetchAll() as $g) {
        $gifts[] = [
            'id'        => $g['id'],
            'title'     => $g['title'],
            'desc'      => $g['description'] ?? '',
            'kind'      => $g['kind'],
            'value'     => $g['value'] ?? '',
            'claimedBy' => $g['claimed_by'] ?? ''
        ];
    }

    // Mural
    $messages = [];
    foreach ($pdo->query("SELECT * FROM messages ORDER BY created_at DESC")->fetchAll() as $m) {
        $messages[] = ['id' => $m['id'], 'name' => $m['name'], 'text' => $m['text'], 'at' => (int)$m['created_at']];
    }

    return ['invites' => $invites, 'gifts' => $gifts, 'messages' => $messages];
}

function seedGifts($pdo) {
    $count = $pdo->query("SELECT COUNT(*) FROM gifts")->fetchColumn();
    if ($count > 0) return;
    $defaults = [
        ['Cofre dos sonhos (PIX)', 'Ajude a Manu a realizar a viagem dos sonhos.', 'pix', '493.930.538-47'],
        ['Wepink',          'Maquiagem e perfumaria.',        'link', 'https://www.wepink.com.br'],
        ['Youcom',          'Moda jovem e estilosa.',         'link', 'https://www.youcom.com.br'],
        ['Renner',          'Moda e lifestyle.',              'link', 'https://www.lojasrenner.com.br'],
        ['Riachuelo',       'Roupas e acessórios.',           'link', 'https://www.riachuelo.com.br'],
        ['C&A',             'Looks para todo dia.',           'link', 'https://www.cea.com.br'],
        ['O Boticário',     'Perfumes e beleza.',             'link', 'https://www.boticario.com.br'],
        ['Vivara',          'Joias e semijoias.',             'link', 'https://www.vivara.com.br'],
        ['Pandora',         'Berloques e joias.',             'link', 'https://br.pandora.net'],
        ['Zara',            'Moda contemporânea.',            'link', 'https://www.zara.com/br'],
        ['Adidas',          'Tênis e esportivo.',             'link', 'https://www.adidas.com.br'],
        ['Livraria Cultura','Mais histórias para colecionar.','link', 'https://www.livrariacultura.com.br/'],
    ];
    $s = $pdo->prepare("INSERT INTO gifts (id,title,description,kind,value,claimed_by,created_at) VALUES (?,?,?,?,?,'',?)");
    $t = nowMs();
    foreach ($defaults as $i => $g) { $s->execute([uid(), $g[0], $g[1], $g[2], $g[3], $t + $i]); }
}

// ── Roteamento ────────────────────────────────────────────────
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $input['action'] ?? 'getAll';

try {
    switch ($action) {

        case 'getAll':
            seedGifts($pdo);
            echo json_encode(getAllData($pdo));
            break;

        case 'addInvite':
            $id      = $input['id']      ?? uid();
            $note    = $input['note']    ?? '';
            $members = $input['members'] ?? [];
            $pdo->prepare("INSERT INTO invites (id,note,confirmed_at,created_at) VALUES (?,?,0,?)")
                ->execute([$id, $note, nowMs()]);
            $s = $pdo->prepare("INSERT INTO invite_members (invite_id,name,status,faixa,sort_order) VALUES (?,?,'pending',?,?)");
            foreach ($members as $i => $m) { $s->execute([$id, $m['name'], $m['faixa'] ?? 'pagante', $i]); }
            echo json_encode(getAllData($pdo));
            break;

        case 'removeInvite':
            $pdo->prepare("DELETE FROM invites WHERE id=?")->execute([$input['id']]);
            echo json_encode(getAllData($pdo));
            break;

        case 'confirmInvite':
            $id       = $input['id'];
            $statuses = $input['statuses'] ?? [];
            $note     = $input['note']     ?? null;
            $s = $pdo->prepare("SELECT id FROM invite_members WHERE invite_id=? ORDER BY sort_order");
            $s->execute([$id]);
            $mids = $s->fetchAll(PDO::FETCH_COLUMN);
            $su = $pdo->prepare("UPDATE invite_members SET status=? WHERE id=?");
            foreach ($mids as $i => $mid) { if (isset($statuses[$i])) $su->execute([$statuses[$i], $mid]); }
            if ($note !== null) {
                $pdo->prepare("UPDATE invites SET confirmed_at=?, note=? WHERE id=?")->execute([nowMs(), $note, $id]);
            } else {
                $pdo->prepare("UPDATE invites SET confirmed_at=? WHERE id=?")->execute([nowMs(), $id]);
            }
            echo json_encode(getAllData($pdo));
            break;

        case 'setMemberStatus':
            $inviteId = $input['inviteId'];
            $idx      = (int)$input['idx'];
            $status   = $input['status'];
            $s = $pdo->prepare("SELECT id FROM invite_members WHERE invite_id=? ORDER BY sort_order LIMIT 1 OFFSET ?");
            $s->execute([$inviteId, $idx]);
            $mid = $s->fetchColumn();
            if ($mid) {
                $pdo->prepare("UPDATE invite_members SET status=? WHERE id=?")->execute([$status, $mid]);
                $pdo->prepare("UPDATE invites SET confirmed_at=CASE WHEN confirmed_at=0 THEN ? ELSE confirmed_at END WHERE id=?")->execute([nowMs(), $inviteId]);
            }
            echo json_encode(getAllData($pdo));
            break;

        case 'addGift':
            $pdo->prepare("INSERT INTO gifts (id,title,description,kind,value,claimed_by,created_at) VALUES (?,?,?,?,?,'',?)")
                ->execute([$input['id'] ?? uid(), $input['title'], $input['desc'] ?? '', $input['kind'] ?? 'link', $input['value'] ?? '', nowMs()]);
            echo json_encode(getAllData($pdo));
            break;

        case 'updateGift':
            $pdo->prepare("UPDATE gifts SET title=?,description=?,kind=?,value=? WHERE id=?")
                ->execute([$input['title'], $input['desc'] ?? '', $input['kind'], $input['value'] ?? '', $input['id']]);
            echo json_encode(getAllData($pdo));
            break;

        case 'removeGift':
            $pdo->prepare("DELETE FROM gifts WHERE id=?")->execute([$input['id']]);
            echo json_encode(getAllData($pdo));
            break;

        case 'claimGift':
            $pdo->prepare("UPDATE gifts SET claimed_by=? WHERE id=?")->execute([$input['name'], $input['id']]);
            echo json_encode(getAllData($pdo));
            break;

        case 'addMessage':
            $pdo->prepare("INSERT INTO messages (id,name,text,created_at) VALUES (?,?,?,?)")
                ->execute([$input['id'] ?? uid(), $input['name'], $input['text'], nowMs()]);
            echo json_encode(getAllData($pdo));
            break;

        case 'removeMessage':
            $pdo->prepare("DELETE FROM messages WHERE id=?")->execute([$input['id']]);
            echo json_encode(getAllData($pdo));
            break;

        default:
            echo json_encode(['error' => 'acao desconhecida']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

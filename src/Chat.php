<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
    protected $clients;
    private $user = [];
    private $message;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        $name = readline("Digite o seu nome:");
        $this->user[$conn->resourceId] = $name;
        echo "Entrou na sala $name...\n";


    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        if (trim($msg) == 'all') {
            return $from->send(json_encode($this->user) . "\n");
        }

        $message = new \stdClass();
        $message->text = $msg;
        $message->sender = $this->user[$from->resourceId];
        $message->timestamp = date('H:i');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send(json_encode($message));
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);

        echo $this->user[$conn->resourceId]." saiu da sala...\n";
        unset($this->user[$conn->resourceId]);

    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}

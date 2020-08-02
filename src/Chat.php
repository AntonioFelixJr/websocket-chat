<?php
namespace App;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface 
{
    protected $clients;
    private $user = [];
    private $message;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        // $name = readline("Digite o seu nome:");
        // $this->user[$conn->resourceId];
        // echo "Entrou na sala $name...\n";


    }

    public function onMessage(ConnectionInterface $from, $response) 
    {
        $response = json_decode($response);

        //if (empty($response->sender)) return $from->send(json_encode(["error" => "Usuário não enviado."]));

        //if (empty($response->message)) return $from->send(json_encode(["error" => "Mensagem vazia."]));

        $numRecv = count($this->clients) - 1;

        
        if ($response->action === 'login' && empty($this->user[$from->resourceId])) {

            $this->user[$from->resourceId]['id'] = $from->resourceId;
            $this->user[$from->resourceId]['name'] = $response->sender;
            return $from->send(json_encode(["login" => $this->user]) . "\n");

        } else if ($this->user[$from->resourceId]['id'] !== $from->resourceId ) {
            return $from->send(json_encode(["error" => "Usuário não logado"]));
        }

        $message = new \stdClass();
        $message->message = $response->message;
        $message->sender = $this->user[$from->resourceId]['name'];
        $message->timestamp = date('H:i');

        foreach ($this->clients as $client) {
            // if ($from !== $client) {
                $client->send(json_encode($message));
            //}
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        //unset($this->user[$conn->resourceId]);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}

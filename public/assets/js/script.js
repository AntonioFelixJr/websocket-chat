Vue.component('chat', {
    template: `
    <section class="discussion">
        <span  v-for="message in messages">
            <message-sender :class="classMessage" sender="message.sender" 
                message="message.text" timestamp="message.timestamp" ></message-sender>
        </span>
    </section>
    `,
    mounted() {
        // inicia a conexao via websoket
        this.startConnection()
    },
    data() {
        return {
            seq: 1,
            conn: null,
            messages: []
        }
    },
    methods: {
        sendMessage(message) {
            this.conn.send(message)
        },
        startConnection() {
            this.conn = new WebSocket('ws://localhost:8080')
            this.conn.onopen = function (e) {
                console.log("Connection established!")

            }

            // Evento que será chamado quando houver erro na conexão
            this.conn.onerror = function() {
                console.log('Não foi possível conectar-se ao servidor');
            };

            // Evento que será chamado quando recebido dados do servidor
            console.log(typeof this.messages, typeof this.seq, typeof this.conn, "MESSAGE 1")

            this.conn.onmessage = function(e) {
                //console.log(JSON.parse(e.data))
                const newMessage = JSON.parse(e.data)
                console.log(newMessage)
                console.log(typeof this.messages, typeof this.seq, typeof this.conn, "MESSAGE 2")
                
                
                this.messages.push(newMessage)
            };
        }
        // onMessage() {
        //     conn.onmessage = function (e) {
        //         let message = JSON.parse(e.data)
        //         addMessageView(message.sender, message.text, message.timestamp)
        //     }
        // }
    },
    computed: {
        classMessage() {
            if (this.seq > 1) {
                return "bubble sender middle"
            }
            return "bubble sender first"
        }
    }
})

Vue.component('message-sender', {
    props: ['message','sender', 'timestamp'],
    template: `
    <div>
        {{ message }}
    </div>
    `
})

new Vue ({
    el: '#app'
})
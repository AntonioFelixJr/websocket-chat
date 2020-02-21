Vue.component('chat', {
    template: `
    <div>
        <section class="discussion" mb-5>
            <message-sender v-for="message, index in messages" :key="index"
                :class="classMessage" :sender="message.sender" 
                :message="message.text" :timestamp="message.timestamp" ></message-sender>
        </section>
        <div class="input-group fixed-bottom">
            <input type="text" class="form-control" placeholder="Digite algo"
            @keyup.enter="sendMessage" v-model="typedMessage">
            <div class="input-group-append">
                <button id="input" class="btn btn-outline-dark" type="button"
                @click="sendMessage">Enviar Mensagem</button>
            </div>
        </div>
    </div>
    `,
    mounted() {
        // inicia a conexao via websoket
        this.startConnection()
    },
    data() {
        return {
            seq: 1,
            conn: null,
            messages: [],
            typedMessage: ''
        }
    },
    methods: {
        sendMessage() {
            this.conn.send(this.typedMessage)
        },
        startConnection() {
            this.conn = new WebSocket('ws://192.168.9.189:8080')
            this.conn.onopen = (e) => {
                console.log("Connection established!")
            }

            // Evento que será chamado quando houver erro na conexão
            this.conn.onerror = () => {
                console.log('Não foi possível conectar-se ao servidor')
            }

            // Evento que será chamado quando recebido dados do servidor
            console.log(typeof this.messages, typeof this.seq, typeof this.conn, "MESSAGE 1")

            this.conn.onmessage = (e) => {
                //console.log(JSON.parse(e.data))
                const newMessage = JSON.parse(e.data)
                console.log(newMessage)
                console.log(typeof this.messages, typeof this.seq, typeof this.conn, "MESSAGE 2")
                
                
                this.messages.push(newMessage)
            }
        }
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
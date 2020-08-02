Vue.component('chat', {
    template: `
    <div>
        <div v-if="!login">
            <input placeholder="Insira seu apelido" v-model:value="nickname" type="text"
                @keyup.enter="loginWs">
        </div>
        <template v-else>
            <section class="discussion" mb-5>
                <message-sender v-for="message, index in messages" :key="index"
                    :class="classMessage" :sender="message.sender" 
                    :message="message.message" :timestamp="message.timestamp">
                </message-sender>
            </section>
            <div class="input-group fixed-bottom">
                <input type="text" class="form-control shadow-none border-1" placeholder="Digite algo"
                @keyup.enter="sendMessage" v-model="typedMessage">
                <div class="input-group-append">
                    <button id="input" class="btn btn-outline-dark" type="button"
                    @click="sendMessage">Enviar Mensagem</button>
                </div>
            </div>
        </template>
    </div>
    `,
    mounted() {
        // inicia a conexao via websoket
        this.startConnection()
    },
    data() {
        return {
            seq: 1,
            login: false,
            id: 0,
            nickname: '',
            conn: null,
            messages: [],
            typedMessage: ''
        }
    },
    methods: {
        loginWs() {
            const request = JSON.stringify({action: 'login',sender: this.nickname})
            console.log(request)
            this.conn.send(request)
        },
        sendMessage() {
            const request = JSON.stringify({action: 'send',sender: this.nickname, message: this.typedMessage})
            console.log(request)
            this.conn.send(request)
        },
        startConnection() {
            this.conn = new WebSocket('ws://localhost:8070')
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
                const data = JSON.parse(e.data)
                if (data.login) {
                    this.login = true
                    this.id = data.login.id
                    this.nickname = data.login.name
                    alert("login com sucesso")
                    return true
                } else if (data.error) {
                    alert(data.error)
                }
                console.log(data)
                console.log(typeof this.messages, typeof this.seq, typeof this.conn, "MESSAGE 2")
                
                
                this.messages.push(data)
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
        <div class="message-header"> 
            {{ sender }}
        </div> 
        <div class="message-body"> 
            {{ message }}
        </div> 
        <div class="message-footer"> 
            {{ timestamp }}
        </div> 
    </div>
    `
})


new Vue ({
    el: '#app'
})
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

function sendMessageWithRetry(contact, message) {
    client.sendMessage(contact, message).then(() => {
        console.log('Mensagem enviada para', contact, ':', message);
    }).catch((err) => {
        console.error('Erro ao enviar mensagem para', contact, ':', err);
    });
}

function sendOptions(contact, options) {
    options.forEach(option => {
        sendMessageWithRetry(contact, option);
    });
}

client.on('qr', (qr) => {
    
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Conectado!');
});

client.on('message', msg => {
    const contact = msg.from;
    const body = msg.body.toLowerCase();

    switch (body) {
        case 'oi':
            sendMessageWithRetry(contact, 'Olá, eu sou Thiago programador da ativmob, como posso ajudar?');
            sendOptions(contact, ['1. Problemas na integração?', '2. Deseja ajuda técnica?', '3. Outros']);
            break;
        case '1':
            sendOptions(contact, ['Qual integração está com problemas?', 'MOTTU', 'OPÇÃO EXPRESS', 'HELP ENTREGAS', 'FREDEX']);
            break;
        case 'mottu':
        case 'opção express':
        case 'help entregas':
        case 'fredex':
            sendMessageWithRetry(contact, 'Digite qual motivo do problema que está acontecendo.');
            break;
        default:
            // Mensagem de opção inválida
            sendMessageWithRetry(contact, 'Opção inválida. Por favor, escolha uma opção válida.');
    }
});

client.initialize();

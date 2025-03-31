const canvas = document.getElementById('JogoCanvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 400

let gravidade = 0.7
let gameOver = false
let maxPulos = 2
let pulos = 0
let pontuacao = 0
let melhorPontuacao = localStorage.getItem('melhorPontuacao') || 0

document.addEventListener('keypress', evento => {
    if (evento.code === 'Space' && !gameOver && pulos < maxPulos) {
        personagem.velocidade_y = -15;
        pulos++
    }
})

document.body.style.backgroundColor = "black"

const imagemDeFundo = new Image()
imagemDeFundo.src = "fundo.jpg"

const imagemPersonagem = new Image()
imagemPersonagem.src = "persona.png"

const imagemObstaculo = new Image()
imagemObstaculo.src = "obstaculo.png"

const personagem = {
    x: 100,
    y: canvas.height - 100,
    largura: 90,
    altura: 90,
    velocidade_y: 0
}

const obstaculo = {
    x: canvas.width,
    y: canvas.height - 100,
    largura: 80, 
    altura: Math.random() * (150 - 50) + 50,
    velocidade_x: 5
}

function aumentarVelocidade() {
    if (!gameOver) {
        obstaculo.velocidade_x += 0.1
    }
}

setInterval(aumentarVelocidade, 1000)

function desenharPersonagem() {
    ctx.drawImage(imagemPersonagem, personagem.x, personagem.y, personagem.largura, personagem.altura);
}

function desenharObstaculo() {
    ctx.drawImage(imagemObstaculo, obstaculo.x, canvas.height - obstaculo.altura, obstaculo.largura, obstaculo.altura);
}

function desenharImagemDeFundo() {
    ctx.drawImage(imagemDeFundo, 0, 0, canvas.width, canvas.height);
}

function atualizarPersonagem() {
    if (!gameOver) {
        personagem.y += personagem.velocidade_y;
        personagem.velocidade_y += gravidade;

        if (personagem.y >= canvas.height - personagem.altura) {
            personagem.y = canvas.height - personagem.altura;
            personagem.velocidade_y = 0;
            pulos = 0;
        }
    }
}

function atualizarObstaculo() {
    if (!gameOver) {
        obstaculo.x -= obstaculo.velocidade_x;

        if (obstaculo.x + obstaculo.largura < 0) {
            obstaculo.x = canvas.width
            obstaculo.altura = Math.random() * (150 - 50) + 50
            pontuacao++;
            if (pontuacao > melhorPontuacao) {
                melhorPontuacao = pontuacao;
                localStorage.setItem('melhorPontuacao', melhorPontuacao)
            }
        }

        if (
            personagem.x < obstaculo.x + obstaculo.largura &&
            personagem.x + personagem.largura > obstaculo.x &&
            personagem.y < canvas.height &&
            personagem.y + personagem.altura > canvas.height - obstaculo.altura
        ) {
            gameOver = true
            setTimeout(reiniciarJogo, 3000)
        }
    }
}

function exibirPontuacao() {
    ctx.fillStyle = 'pink'
    ctx.font = '20px Arial'
    ctx.fillText(`Pontuação: ${pontuacao}`, 10, 30)
    ctx.fillText(`Melhor Pontuação: ${melhorPontuacao}`, 10, 60)
}

function exibirMensagemGameOver() {
    if (gameOver) {
        ctx.fillStyle = 'pink'
        ctx.font = '50px Arial'
        ctx.fillText('GAME OVER', canvas.width / 4, canvas.height / 2)
    }
}

function reiniciarJogo() {
    obstaculo.x = canvas.width
    obstaculo.altura = Math.random() * (150 - 50) + 50
    personagem.x = 100
    personagem.y = canvas.height - personagem.altura
    personagem.velocidade_y = 0
    gameOver = false
    pontuacao = 0
    obstaculo.velocidade_x = 5
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    desenharImagemDeFundo()
    desenharPersonagem()
    desenharObstaculo()
    atualizarPersonagem()
    atualizarObstaculo()
    exibirPontuacao()
    exibirMensagemGameOver()
    requestAnimationFrame(loop)
}

imagemDeFundo.onload = () => {
    imagemPersonagem.onload = () => {
        imagemObstaculo.onload = () => {
            loop()
        }
    }
}

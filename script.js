const solicitarQuizzes = axios.get(
  'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
)
solicitarQuizzes.then(quizzesPag1)

//APRESENTANDO QUIZZES DO SERVIDOR NA TELA 1
function quizzesPag1(resposta) {
  let quizz = resposta.data
  let containerQuizzes = document.querySelector('ul')
  for (let i = 0; i < quizz.length; i++) {
    containerQuizzes.innerHTML += `<li style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizz[i].image})" class="quizz" onclick="infoQuizz(${quizz[i].id})">
    <p class="nome-quizz">${quizz[i].title}</p>
    </li>`
  }
}

function infoQuizz(id) {
  const teste = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`
  )
  teste.then(quizzTela2)
}
function quizzTela2(resposta) {
  const infoQuizz = resposta.data
  const fecharTela1 = document.querySelector('.tela1')
  fecharTela1.classList.add('display-none')
  const abrirTela2 = document.querySelector('.tela2')
  abrirTela2.classList.remove('display-none')

  // GERANDO IMAGEM DO TOPO DA TELA 2
  const cabecalhoTela2 = document.querySelector('.cabecalho-tela2')
  cabecalhoTela2.innerHTML = `<div class="img-tela2">
    <p class="nome-quizz-2">${infoQuizz.title}</p>
    </div>
    <style>
    .img-tela2 {
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${infoQuizz.image});
    }</style>`

  const caixaPergunta = document.querySelector('.caixa-perguntas')

  // GERANDO AS OPÇOES DE RESPOSTA
  for (let i = 0; i < infoQuizz.questions.length; i++) {
    caixaPergunta.innerHTML += `<div class="pergunta">
    <div style="background-color: ${infoQuizz.questions[i].color}" class="titulo-pergunta">${infoQuizz.questions[i].title}</div>
    <div class="todasRespostas"></div>
    </div>`

    const tdsRespostas = document.querySelectorAll('.todasRespostas')
    let perguntasEmbaralhadas = infoQuizz.questions[i].answers
    perguntasEmbaralhadas.sort(comparador)
    for (let j = 0; j < perguntasEmbaralhadas.length; j++) {
      tdsRespostas[
        i
      ].innerHTML += `<div class="opcao-resposta ${perguntasEmbaralhadas[j].isCorrectAnswer}" onclick="selecionarResposta(this)">
          <div><img class="img-pergunta" src="${perguntasEmbaralhadas[j].image}"></img></div>
          <p class="opcao-pergunta">${perguntasEmbaralhadas[j].text}</p>
        </div>
        `
    }
  }
}

// FUNCTION QUE SORTEIA O ARRAY
function comparador() {
  return Math.random() - 0.5
}

// OQUE OCORRE AO CLICAR NO REINICIAR QUIZZ
function reiniciarQuizz() {
  window.scrollTo(0, 0)
  /* let zerarCliques = document.querySelectorAll('.todasRespostas')
  console.log(zerarCliques)
  zerarCliques.classList.remove('resposta-errada resposta-correta') */
}

//INICIO TELA 3
function tela3() {
  const fecharTela1 = document.querySelector('.tela1')
  fecharTela1.classList.add('display-none')
  const abrirTela3 = document.querySelector('.tela3')
  abrirTela3.classList.remove('display-none')
}
function tela31() {
  const fecharTela3 = document.querySelector('.tela3')
  fecharTela3.classList.add('display-none')
  const abrirTela31 = document.querySelector('.tela31')
  abrirTela31.classList.remove('display-none')
}
function tela32() {
  const fecharTela31 = document.querySelector('.tela31')
  fecharTela31.classList.add('display-none')
  const abrirTela32 = document.querySelector('.tela32')
  abrirTela32.classList.remove('display-none')
}
function tela33() {
  const fecharTela32 = document.querySelector('.tela32')
  fecharTela32.classList.add('display-none')
  const abrirTela33 = document.querySelector('.tela33')
  abrirTela33.classList.remove('display-none')
}
// COMPORTAMENTO DAS RESPOSTAS

function selecionarResposta(opcaoClicada) {
  const parente = opcaoClicada.parentNode
  const todasRespostas = parente.children
  console.dir(parente.parentNode)
  const imagens = []
  for (let i = 0; i < todasRespostas.length; i++) {
    if (todasRespostas[i].classList.contains('false')) {
      todasRespostas[i].classList.add('resposta-errada')
    } else {
      todasRespostas[i].classList.add('resposta-correta')
    }
    imagens.push(todasRespostas[i].firstElementChild)
    imagens[i].innerHTML += `<div class='esbranquicado'></div>`
    todasRespostas[i].removeAttribute('onclick')
  }
  opcaoClicada.firstElementChild.children[1].remove()
  setTimeout(scrollar, 2000, parente)
}

function scrollar(elemento) {
  elemento.parentNode.nextElementSibling.scrollIntoView()
}

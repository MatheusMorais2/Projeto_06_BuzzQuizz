const solicitarQuizzes = axios.get(
  'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
)
solicitarQuizzes.then(quizzesPag1)

/* function carregarQuizzes(resposta) {
  let quizz = resposta.data
  return quizz
} */

function quizzesPag1(resposta) {
  /* let quizz = carregarQuizzes() */
  let quizz = resposta.data
  let containerQuizzes = document.querySelector('ul')
  for (let i = 0; i < quizz.length; i++) {
    containerQuizzes.innerHTML += `<li style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizz[i].image})" class="quizz" onclick="infoQuizz()">
    <p class="nome-quizz">${quizz[i].title}</p>
    </li>`
  }
}

function infoQuizz() {
  const teste = axios.get(
    'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1'
  )
  teste.then(quizzTela2)
}
function quizzTela2(resposta) {
  const infoQuizz = resposta.data
  const fecharTela1 = document.querySelector('.tela1')
  fecharTela1.classList.add('display-none')
  const abrirTela2 = document.querySelector('.tela2')
  abrirTela2.classList.remove('display-none')

  const cabecalhoTela2 = document.querySelector('.cabecalho-tela2')
  cabecalhoTela2.innerHTML = `<div class="img-tela2">
    <p class="nome-quizz-2">${infoQuizz.title}</p>
    </div>
    <style>
    .img-tela2 {
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${infoQuizz.image});
    }</style>`

  const caixaPergunta = document.querySelector('.caixa-perguntas')
  for (let i = 0; i < infoQuizz.questions.length; i++) {
    caixaPergunta.innerHTML += `<div class="pergunta">
    <div style="background-color: ${infoQuizz.questions[i].color}" class="titulo-pergunta">${infoQuizz.questions[i].title}</div>
    <div class="todasRespostas"></div>
    </div>`

    const tdsRespostas = document.querySelectorAll('.todasRespostas')
    for (let j = 0; j < infoQuizz.questions[i].answers.length; j++) {
      console.log(infoQuizz.questions[i].answers[j].text)
      tdsRespostas[i].innerHTML += `<div class="opcao-resposta">
          <img class="img-pergunta" src="${infoQuizz.questions[i].answers[j].image}"></img>
          <p class="opcao-pergunta">${infoQuizz.questions[i].answers[j].text}</p>
        </div>
        `
    }
  }

  /* const adicionaCaixa = document.querySelector('pergunta')
  const adicionaPergunta = document.querySelector('.caixa-pergunta')
  for (let x = 0; x < infoQuizz.questions.length; x++) {
    adicionaPergunta.innerHTML = tituloPergunta + opcoesResposta
  } */
}

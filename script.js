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
      tdsRespostas[i].innerHTML += `<div class="opcao-resposta ${infoQuizz.questions[i].answers[j].isCorrectAnswer}" onclick="selecionarResposta(this)">
          <div><img class="img-pergunta" src="${infoQuizz.questions[i].answers[j].image}"></img></div>
          <p class="opcao-pergunta">${infoQuizz.questions[i].answers[j].text}</p>
        </div>
        `;
    }
  }

  /* const adicionaCaixa = document.querySelector('pergunta')
  const adicionaPergunta = document.querySelector('.caixa-pergunta')
  for (let x = 0; x < infoQuizz.questions.length; x++) {
    adicionaPergunta.innerHTML = tituloPergunta + opcoesResposta
  } */
}


// COMPORTAMENTO DAS RESPOSTAS

function selecionarResposta(opcaoClicada) {
  const parente = opcaoClicada.parentNode;
  const todasRespostas = parente.children;
  console.dir(parente.parentNode);
  const imagens = [];
  for (let i=0; i<todasRespostas.length;i++) {
    if(todasRespostas[i].classList.contains('false')) {
      todasRespostas[i].classList.add('resposta-errada');
    } else {
      todasRespostas[i].classList.add('resposta-correta');
    }
    imagens.push(todasRespostas[i].firstElementChild);
    imagens[i].innerHTML += `<div class='esbranquicado'></div>`;
    todasRespostas[i].removeAttribute('onclick');
  }
  opcaoClicada.firstElementChild.children[1].remove();
  setTimeout(scrollar,2000, parente);
}

function scrollar(elemento) {
  elemento.parentNode.nextElementSibling.scrollIntoView();
}
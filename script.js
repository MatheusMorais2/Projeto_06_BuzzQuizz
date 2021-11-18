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
  console.log(quizz)
  let containerQuizzes = document.querySelector('ul')
  containerQuizzes.innerHTML = `<li class="quizz" onclick="quizzTela2()">
  <p class="nome-quizz">${quizz[0].title}</p>
  </li>
  <style>
  .quizz {
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizz[0].image});
  }</style>`
}

function quizzTela2() {
  const carregarQuizzes = axios.get(
    'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
  )
  carregarQuizzes.then
  const fecharTela1 = document.querySelector('.seus-quizzes')
  fecharTela1.classList.add('display-none')
  const abrirTela2 = document.querySelector('.tela2')
  abrirTela2.classList.remove('display-none')
}

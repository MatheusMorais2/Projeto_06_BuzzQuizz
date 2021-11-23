const solicitarQuizzes = axios.get(
  'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
)
let pontuacao = 0
let levelsDoQuizz = []
let idGlobal = 0
let objQuizzCriado = { title: '', image: '', questions: [], levels: [] }
let idsKeysQuizzCriados = localStorage.getItem('lista-id-key-teste') //era 'lista-quizz-criados'
console.log(idsKeysQuizzCriados)
let listaIdKeyteste = JSON.parse(idsKeysQuizzCriados) // Esse array contem as id e as keys dos quizz criados
let onlyCreatedIds = [];
if (listaIdKeyteste === null){
} else {
  onlyCreatedIds = listaIdKeyteste.map( a => a.id);
}



solicitarQuizzes.then(quizzesPag1)
solicitarQuizzes.then(separarMeusQuizzes)

function compararQuizzCriados(value) {  
    return onlyCreatedIds.includes(value.id); 
}

function separarMeusQuizzes(resposta) {
  let quizz = resposta.data
  let meusQuizzes = quizz.filter(compararQuizzCriados)
  
  apresentarQuizzCriado(meusQuizzes)
}

//APRESENTANDO QUIZZES DO SERVIDOR NA TELA 1
function quizzesPag1(resposta) {
  let quizz = resposta.data
  let containerQuizzes = document.querySelector('.opcoes-quizzes')
  for (let i = 0; i < quizz.length; i++) {
    containerQuizzes.innerHTML += `<li style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizz[i].image})" class="quizz" onclick="infoQuizz(${quizz[i].id})" data-identifier="quizz-card">
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
  levelsDoQuizz = infoQuizz.levels
  idGlobal = infoQuizz.id
  window.scrollTo(0, 0)
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

  // GERANDO AS OPÇOES DE RESPOSTA
  for (let i = 0; i < infoQuizz.questions.length; i++) {
    const caixaPergunta = document.querySelector('.caixa-perguntas')
    caixaPergunta.innerHTML += `<div class="pergunta" data-identifier="question">
    <div style="background-color: ${infoQuizz.questions[i].color}" class="titulo-pergunta">${infoQuizz.questions[i].title}</div>
    <div class="todasRespostas"></div>
    </div>`

    const tdsRespostas = document.querySelectorAll('.todasRespostas')
    let perguntasEmbaralhadas = infoQuizz.questions[i].answers
    perguntasEmbaralhadas.sort(comparador)
    for (let j = 0; j < perguntasEmbaralhadas.length; j++) {
      tdsRespostas[
        i
      ].innerHTML += `<div class="opcao-resposta ${perguntasEmbaralhadas[j].isCorrectAnswer}" onclick="selecionarResposta(this)" data-identifier="answer">
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
}

// COMPORTAMENTO DAS RESPOSTAS
function selecionarResposta(opcaoClicada) {
  const parente = opcaoClicada.parentNode
  const todasRespostas = parente.children
  const imagens = []

  if (opcaoClicada.classList.contains('true')) {
    //INCREMENTO DA PONTUACAO DO QUIZZ
    pontuacao++
  }

  for (let i = 0; i < todasRespostas.length; i++) {
    //ADICIONA OS ESTILOS DE CERTO OU ERRADO
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

  const listaDePerguntas = document.querySelector('.caixa-perguntas').childNodes

  if (parente.parentNode.nextElementSibling) {
    //Ver se tem mais alguma pergunta pra responder
    setTimeout(scrollar, 2000, parente)
  } else {
    //Se nao tiver, apresentar a tela de resultados
    const porcentagemDeAcertos = Math.floor(
      (pontuacao / listaDePerguntas.length) * 100
    )
    setTimeout(mostrarResultado, 2000, porcentagemDeAcertos)
  }
}

function scrollar(elemento) {
  elemento.parentNode.nextElementSibling.scrollIntoView()
}

let levelCertoTeste = 0
function mostrarResultado(porcentagemDeAcertos) {
  const caixaPerguntas = document.querySelector('.caixa-perguntas')
  zerarInnerHTML(caixaPerguntas);

  for (let i = 0; i < levelsDoQuizz.length; i++) {
    if (
      porcentagemDeAcertos > levelsDoQuizz[i].minValue &&
      levelCertoTeste < levelsDoQuizz.length - 1
    ) {
      levelCertoTeste++
    }
  }
  caixaPerguntas.innerHTML += `<div class="resultado-quizz" data-identifier="quizz-result">
                                <header>${porcentagemDeAcertos}% de acerto: ${levelsDoQuizz[levelCertoTeste].title}
                                </header>
                                <main>
                                  <img src="${levelsDoQuizz[levelCertoTeste].image}" alt="Imagem do nivel de acerto do quizz">
                                  <p>
                                    ${levelsDoQuizz[levelCertoTeste].text}
                                  </p>
                                </main>
                              </div>
                              <footer>
                                <button id='reiniciar-quizz' onclick="reiniciarTela2()">
                                  Reiniciar Quizz
                                </button>
                                <button id='voltar-pra-home' onclick="limparTela2()">
                                  Voltar pra home
                                </button>
                              </footer>`
  const resultadoFinal = document.querySelector('.resultado-quizz')
  resultadoFinal.scrollIntoView()
  levelCertoTeste = 0
  pontuacao = 0
  levelsDoQuizz = []
}

function reiniciarTela2() {
  const caixaPerguntas = document.querySelector('.caixa-perguntas')
  caixaPerguntas.innerHTML = ''
  const bannerTela2 = document.querySelector('.img-tela2')
  bannerTela2.scrollIntoView()
  infoQuizz(idGlobal)
}

function limparTela2() {
  document.querySelector('.tela2').classList.add('display-none')
  const caixaPerguntas = document.querySelector('.caixa-perguntas')
  zerarInnerHTML(caixaPerguntas);
  document.querySelector('.tela1').classList.remove('display-none')
  window.scrollTo(0, 0)
}

//INICIO TELA 3
function tela3() {
  const fecharTela1 = document.querySelector('.tela1')
  fecharTela1.classList.add('display-none')
  const abrirTela3 = document.querySelector('.tela3')
  abrirTela3.classList.remove('display-none')
}

function criacaoQuizz() {
  let contador = 0

  const inputTitulo = document.getElementById('criacao-titulo')
  if (inputTitulo.value.length >= 20 || inputTitulo.value.length <= 65) {
    objQuizzCriado.title = inputTitulo.value
    contador++
  } else {
    alert('Titulo inadequado. O titulo devera ter entre 20 e 65 caracteres')
  }

  const inputImagem = document.getElementById('criacao-imagem')
  if (/^(ftp|http|https):\/\/[^ "]+$/.test(inputImagem.value)) {
    objQuizzCriado.image = inputImagem.value
    contador++
  } else {
    alert('Url da Imagem invalida, por favor tente outra')
  }

  const inputQtdPerguntas = document.getElementById('criacao-qnt-perguntas')
  if (
    Number.isInteger(parseInt(inputQtdPerguntas.value)) &&
    inputQtdPerguntas.value >= 3
  ) {
    for (let i = 0; i < inputQtdPerguntas.value; i++) {
      objQuizzCriado.questions.push({
        title: '',
        color: '',
        answers: [
          { text: '', image: '', isCorrectAnswer: false },
          { text: '', image: '', isCorrectAnswer: false },
          { text: '', image: '', isCorrectAnswer: false },
          { text: '', image: '', isCorrectAnswer: false }
        ]
      })
    }
    contador++
  } else {
    alert(
      'Quantidade de perguntas invalido, por favor digite um numero maior que 2'
    )
  }

  const inputQtdNiveis = document.getElementById('criacao-qtd-niveis')
  if (
    Number.isInteger(parseInt(inputQtdNiveis.value)) &&
    inputQtdNiveis.value >= 2
  ) {
    for (let i = 0; i < inputQtdNiveis.value; i++) {
      objQuizzCriado.levels.push({
        title: '',
        image: '',
        text: '',
        minValue: 0
      })
    }
    contador++
  } else {
    alert(
      'Quantidade de niveis invalido, por favor digite um numero maior que 1'
    )
  }

  if (contador === 4) {
    inputTitulo.value = ''
    inputImagem.value = ''
    inputQtdNiveis.value = ''
    inputQtdPerguntas.value = ''
    tela31()
  }
}

function tela31() {
  const fecharTela3 = document.querySelector('.tela3')
  fecharTela3.classList.add('display-none')
  const abrirTela31 = document.querySelector('.tela31')
  abrirTela31.classList.remove('display-none')

  //COLOCAR O FORMULARIO NA TELA
  const caixaFormularioTela31 = document.querySelector(
    '.caixa-formulario-tela31'
  )
  zerarInnerHTML(caixaFormularioTela31);
  for (let i = 0; i < objQuizzCriado.questions.length; i++) {
    caixaFormularioTela31.innerHTML += `<div id="container-pergunta-${i}" data-identifier="question">
    <div class="expandir">
      <p class="subtitulo-tela31">Pergunta ${i+1}</p>
      <ion-icon name="create-outline" onclick="expandirPerguntas(${i})"></ion-icon>
    </div>
    </div>`
  }
}
function validarPerguntas() {
  let verificadorResposta = 0
  let verificadorTitulo = 0

  for (let i = 0; i < objQuizzCriado.questions.length; i++) {
    objQuizzCriado.questions[i].title = document.getElementById(
      `pergunta${i}`
    ).value
    objQuizzCriado.questions[i].color = document.getElementById(
      `cor-pergunta${i}`
    ).value
    objQuizzCriado.questions[i].answers[0].text = document.getElementById(
      `resposta-correta-pergunta${i}`
    ).value
    objQuizzCriado.questions[i].answers[0].image = document.getElementById(
      `imagem-correta-pergunta${i}`
    ).value
    objQuizzCriado.questions[i].answers[0].isCorrectAnswer = true
    for (let j = 1; j < 4; j++) {
      objQuizzCriado.questions[i].answers[j].text = document.getElementById(
        `resposta-incorreta-${j}-pergunta${i}`
      ).value
      objQuizzCriado.questions[i].answers[j].image = document.getElementById(
        `imagem-incorreta-${j}-pergunta${i}`
      ).value
      objQuizzCriado.questions[i].answers[j].isCorrectAnswer = false
      if (
        objQuizzCriado.questions[i].answers[j].text === '' ||
        !/^(ftp|http|https):\/\/[^ "]+$/.test(
          objQuizzCriado.questions[i].answers[j].image
        )
      ) {
        verificadorResposta++
      }
    }
    if (
      objQuizzCriado.questions[i].title < 20 ||
      !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(
        objQuizzCriado.questions[i].color
      )
    ) {
      verificadorTitulo++
    }
  }

  if (verificadorResposta === 0 && verificadorTitulo === 0) {
    tela32()
  } else {
    alert('Algum campo esta no formato errado')
  }
}

function tela32() {
  const fecharTela31 = document.querySelector('.tela31')
  fecharTela31.classList.add('display-none')
  const abrirTela32 = document.querySelector('.tela32')
  abrirTela32.classList.remove('display-none')

  const formulario32 = document.querySelector('.caixa-formulario32')
  zerarInnerHTML(formulario32);
  for (let i = 0; i < objQuizzCriado.levels.length; i++) {
    formulario32.innerHTML += `<div id="container-level-${i}" data-identifier="level">
        <div class="expandir">
          <p class="subtitulo-tela31">Nivel ${i}</p>
          <ion-icon name="create-outline" onclick="expandirNiveis(${i})"></ion-icon>
        </div>
      </div>`
  }
}

function validarNiveis() {
  let verificador = 0
  for (let i = 0; i < objQuizzCriado.levels.length; i++) {
    objQuizzCriado.levels[i].title = document.getElementById(
      `nivel-criado-${i}-titulo`
    ).value
    objQuizzCriado.levels[i].image = document.getElementById(
      `nivel-criado-${i}-imagem`
    ).value
    objQuizzCriado.levels[i].text = document.getElementById(
      `nivel-criado-${i}-descricao`
    ).value
    objQuizzCriado.levels[i].minValue = parseInt(
      document.getElementById(`nivel-criado-${i}-porcentagem`).value
    )

    let testeTitle = objQuizzCriado.levels[i].title.length >= 10
    let testeImagem = /^(ftp|http|https):\/\/[^ "]+$/.test(
      objQuizzCriado.levels[i].image
    )
    let testeMinValue =
      objQuizzCriado.levels[i].minValue >= 0 &&
      objQuizzCriado.levels[i].minValue <= 100
    let testeText = objQuizzCriado.levels[i].text.length >= 30

    if (testeImagem && testeMinValue && testeText && testeTitle) {
    } else {
      verificador++
    }
  }

  if (verificador === 0) {
    console.log(objQuizzCriado);
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes',objQuizzCriado);
    promessa.then(tela33);
  } else {
    alert('Algum campo esta no formato errado');
  }
}

function tela33(respostaQuizzCriado) {
  const fecharTela32 = document.querySelector('.tela32')
  fecharTela32.classList.add('display-none')
  const abrirTela33 = document.querySelector('.tela33')
  abrirTela33.classList.remove('display-none')

  listaIdKeyteste.push({id: respostaQuizzCriado.data.id, key: respostaQuizzCriado.data.key});
  const listaIdKeySerializadoTeste = JSON.stringify(listaIdKeyteste);
  localStorage.setItem('lista-id-key-teste', listaIdKeySerializadoTeste);

/*   listaIdQuizzCriado.push(respostaQuizzCriado.data.id)
  const quizzCriadoSerializado = JSON.stringify(listaIdQuizzCriado)
  localStorage.setItem('lista-quizz-criados', quizzCriadoSerializado) */

  const telaSucessoQuizz = document.querySelector('.img-quizz-pronto')
  telaSucessoQuizz.innerHTML = `<div style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${objQuizzCriado.image})" class="img-quizz-pronto-filho" data-identifier="quizz-card">
                                <p class="nome-quizz">${objQuizzCriado.title}</p>
                                </div>`
  const containerSucessoQuizz = document.querySelector('.container-tela33')
  containerSucessoQuizz.innerHTML += `<button class="reiniciar" onclick="removerTelaApresentarQuizz(${respostaQuizzCriado.data.id})">Acessar Quizz</button>
                                      <button class="voltar-home" onclick="location.reload()">
                                      Voltar para home
                                      </button>`
                                
}

function apresentarQuizzCriado(meusQuizzes) {
  if (meusQuizzes.length !== 0) {
    const fecharQuizzVazio = document.querySelector('.seus-quizzes')
    fecharQuizzVazio.classList.add('display-none')
    const abrirSeusQuizz = document.querySelector('.seus-quizzes-criados')
    abrirSeusQuizz.classList.remove('display-none')

    let containerQuizCriado = document.querySelector('.lista-seus-quizzes')
    for (let i = 0; i < meusQuizzes.length; i++) {

      containerQuizCriado.innerHTML += `<li style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${meusQuizzes[i].image})" class="quizz" data-identifier="quizz-card" onclick="infoQuizz(${meusQuizzes[i].id})">
                                          <p class="nome-quizz">${meusQuizzes[i].title}</p>
                                          <div class="botoes" onclick="event.stopPropagation()" >
                                            <button onclick="editarQuizz(${meusQuizzes[i].id})">
                                              <ion-icon name="create-outline"></ion-icon>
                                            </button>
                                            <button onclick="deletarQuizz(${meusQuizzes[i].id})">
                                              <ion-icon name="trash-outline"></ion-icon>
                                            </button>
                                          </div>
                                        </li>`
    }
  }
}

function removerTelaApresentarQuizz (respostaQuizzCriado) {
  const fecharTela33 = document.querySelector('.tela33')
  fecharTela33.classList.add('display-none');
  infoQuizz(respostaQuizzCriado);
}

function zerarInnerHTML(tela) {
  tela.innerHTML = '';
}

function expandirPerguntas(i) {
  const containerPergunta = document.getElementById(`container-pergunta-${i}`);  
  containerPergunta.innerHTML += `<input id="pergunta${i}" 
      class="resposta-formulario"
      placeholder="   Texto da pergunta"
      type="text"
    />
    <input id="cor-pergunta${i}" 
      class="resposta-formulario cor-pergunta${i}"
      placeholder="   Cor de fundo da pergunta"
      type="text"
    />
    <p class="subtitulo-tela31">Resposta correta</p>
    <input id="resposta-correta-pergunta${i}" 
      class="resposta-formulario"
      placeholder="   Resposta correta"
      type="text"
    />
    <input id="imagem-correta-pergunta${i}" 
      class="resposta-formulario"
      placeholder="   URL da imagem"
      type="text"
    />
    <p class="subtitulo-tela31">Respostas incorretas</p>
    <input id="resposta-incorreta-1-pergunta${i}"
      class="resposta-formulario"
      placeholder="   Resposta incorreta 1"
      type="text"
    />
    <input id="imagem-incorreta-1-pergunta${i}"
      class="resposta-formulario"
      placeholder="   URL da imagem 1"
      type="text"
    />
    <input id="resposta-incorreta-2-pergunta${i}"
      class="resposta-formulario"
      placeholder="   Resposta incorreta 2"
      type="text"
    />
    <input id="imagem-incorreta-2-pergunta${i}"
      class="resposta-formulario"
      placeholder="   URL da imagem 2"
      type="text"
    />
    <input id="resposta-incorreta-3-pergunta${i}"
      class="resposta-formulario"
      placeholder="   Resposta incorreta 3"
      type="text"
    />
    <input id="imagem-incorreta-3-pergunta${i}"
      class="resposta-formulario"
      placeholder="   URL da imagem 3"
      type="text"
    />`
    const icone = document.querySelector('.expandir>ion-icon');
    icone.classList.add('display-none');
}

function expandirNiveis(i) {
  const containerNivel = document.getElementById(`container-level-${i}`);  
  if (i===0) {
    containerNivel.innerHTML += `
  <input id="nivel-criado-0-titulo"
    class="resposta-formulario"
    placeholder="   Título do nível"
    type="text"
  />
  <input id="nivel-criado-0-porcentagem"
    class="resposta-formulario"
    placeholder="   % de acerto mínima"
    value="0"
    disabled
    type="text"
  />
  <input id="nivel-criado-0-imagem"
    class="resposta-formulario"
    placeholder="   URL da imagem do nível"
    type="text"
  />
  <input  id="nivel-criado-0-descricao"
    class="resposta-formulario-grande"
    placeholder="   Descrição do nível"
    type="text"
  />`
  } else {
    containerNivel.innerHTML += `
    <input id="nivel-criado-${i}-titulo"
      class="resposta-formulario"
      placeholder="   Título do nível"
      type="text"
    />
    <input id="nivel-criado-${i}-porcentagem"
      class="resposta-formulario"
      placeholder="   % de acerto mínima"
      type="text"
    />
    <input id="nivel-criado-${i}-imagem"
      class="resposta-formulario"
      placeholder="   URL da imagem do nível"
      type="text"
    />
    <input  id="nivel-criado-${i}-descricao"
      class="resposta-formulario-grande"
      placeholder="   Descrição do nível"
      type="text"
    />`
  }
  
}

function verificar (resposta) {
  listaIdKeyteste.push({id: resposta.data.id, key: resposta.data.key});
  const listaIdKeySerializadoTeste = JSON.stringify(listaIdKeyteste);
  localStorage.setItem('lista-id-key-teste', listaIdKeySerializadoTeste);
}

function deletarQuizz (id){ 
  const obj = listaIdKeyteste.find(elemento => elemento.id === id)
  const testeDelete = axios({
      method: 'delete',
      url: `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${obj.id}`,
      header: {'Secret-key': obj.key}
    })
  testeDelete.catch(processarDelete);
}

function editarQuizz(id) {
  const obj = listaIdKeyteste.find(elemento => elemento.id === id)
  const testeEditar = axios({
      method: 'put',
      url: `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${obj.id}`,
      header: {'Secret-key': obj.key}
    })
  testeEditar.catch(processarDelete);
}
 
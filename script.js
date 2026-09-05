const funcionarios = [
  "Lucas Trindade",
  "Matheus Senhorinho",
  "Wilson Ramos",
  "Ricardo Lima",
  "Danilo Pereira dos Santos",
  "Miranda",
  "Dalton",
  "Pedro",
  "Eduardo Lima",
  "João Paulo",
  "Geraldo",
  "Eric da Conceição",
  "Victor Costa",
  "Mateus Santos",
  "Jose Ramos"
];

const postos = ["G6", "G8", "G5", "G2", "G1", "R1", "R2", "G10", "G11", "G12", "G13"];
const fortes = ["G6", "G8", "G5", "G2", "G1"];
const gruposPostos = {
  "🔥 Prioridade mínima": ["G6", "G8", "G5", "G2", "G1", "R1"],
  "🟢 Segunda rendição": ["R2"],
  "🔵 Máquinas extras": ["G10", "G11", "G13", "G12"]
};
const metas = [
  ["GRU01", "R$ 4.000,00", "R$ 5.000,00", "—"],
  ["GRU02", "R$ 4.000,00", "R$ 4.500,00", "—"],
  ["GRU05", "R$ 6.500,00", "R$ 6.000,00", "R$ 2.500,00"],
  ["GRU06", "R$ 8.000,00", "R$ 13.000,00", "R$ 2.800,00"],
  ["GRU08", "R$ 7.500,00", "R$ 10.500,00", "R$ 6.200,00"],
  ["GRU10", "R$ 4.000,00", "R$ 6.250,00", "R$ 2.250,00"],
  ["GRU11", "R$ 4.200,00", "R$ 5.800,00", "R$ 4.700,00"],
  ["GRU12", "R$ 4.500,00", "R$ 4.500,00", "—"],
  ["GRU13", "R$ 2.500,00", "R$ 1.250,00", "—"]
];
const hojeData = new Date();
const hoje = hojeData.getDate();
const mesAtual = hojeData.getMonth();
const anoAtual = hojeData.getFullYear();
let diaSelecionado = 1;
let usuarioAdmin = null;

const supabaseClient = window.supabase ? window.supabase.createClient(
  "https://ohelcxrqunxijpbpzivn.supabase.co",
  "sb_publishable_maWNEaXNb3dq-Oasa9ATaA_uh345fkc"
) : null;

function obterDiaParaMostrar() {
  const configMes = mesesDisponiveis[mesSelecionado];
  if (configMes.mes === mesAtual && configMes.ano === anoAtual) {
    return hoje;
  }
  return 1;
}

async function carregarEdicoesSalvas() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("escala_edicoes")
    .select("mes, dia, escala");

  if (error) {
    console.warn("Não foi possível carregar as edições salvas.", error.message);
    return;
  }

  data.forEach(edicao => {
    if (mesesDisponiveis[edicao.mes]) {
      mesesDisponiveis[edicao.mes].escalaManual[edicao.dia] = edicao.escala;
    }
  });
}

function atualizarAcessoAdmin() {
  const loginForm = document.getElementById("loginForm");
  const logoutButton = document.getElementById("logoutButton");
  const status = document.getElementById("loginStatus");
  const editorButton = document.querySelector(".editar-dia-btn");

  if (loginForm) loginForm.hidden = Boolean(usuarioAdmin);
  if (logoutButton) logoutButton.hidden = !usuarioAdmin;
  if (status) status.textContent = usuarioAdmin ? `Administrador conectado: ${usuarioAdmin.email}` : "";
  if (editorButton) editorButton.hidden = !usuarioAdmin;
}

async function iniciarAutenticacao() {
  if (!supabaseClient) return;
  const loginForm = document.getElementById("loginForm");
  const logoutButton = document.getElementById("logoutButton");
  const status = document.getElementById("loginStatus");

  if (loginForm) {
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      if(status) status.textContent = "Entrando...";
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
      });

      if (error) {
        if(status) status.textContent = "E-mail ou senha inválidos.";
        return;
      }

      usuarioAdmin = data.user;
      loginForm.reset();
      atualizarAcessoAdmin();
      mostrarDia(diaAtual);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      usuarioAdmin = null;
      atualizarAcessoAdmin();
      mostrarDia(diaAtual);
    });
  }

  const { data } = await supabaseClient.auth.getSession();
  usuarioAdmin = data.session?.user || null;
  atualizarAcessoAdmin();
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    usuarioAdmin = session?.user || null;
    atualizarAcessoAdmin();
  });
}

const folgasPorDia = {
  1: ["Eduardo Lima", "Dalton", "Wilson Ramos"],
  2: ["Miranda", "João Paulo"],
  3: ["Lucas Trindade", "Danilo Pereira dos Santos"],
  4: ["Ricardo Lima", "Dalton", "Pedro", "Eduardo Lima", "Geraldo", "Victor Costa"],
  5: ["Wilson Ramos", "Ricardo Lima", "Dalton", "Pedro", "Eduardo Lima", "Geraldo", "Victor Costa"],
  6: ["Matheus Senhorinho", "João Paulo"],
  7: ["Miranda", "Pedro"],
  8: ["Danilo Pereira dos Santos", "Dalton", "Victor Costa"],
  9: ["Lucas Trindade", "Ricardo Lima", "Geraldo"],
  10: ["Lucas Trindade", "Wilson Ramos", "João Paulo"],
  11: ["Matheus Senhorinho", "Wilson Ramos", "Miranda", "Eduardo Lima"],
  12: ["Matheus Senhorinho", "Wilson Ramos", "Danilo Pereira dos Santos", "Miranda", "Eduardo Lima"],
  13: ["Danilo Pereira dos Santos", "Pedro"],
  14: ["Lucas Trindade", "Dalton"],
  15: ["Ricardo Lima", "João Paulo", "Geraldo", "Victor Costa"],
  16: ["Wilson Ramos", "Eduardo Lima"],
  17: ["Matheus Senhorinho", "Miranda"],
  18: ["Lucas Trindade", "Dalton", "Pedro", "João Paulo"],
  19: ["Lucas Trindade", "Danilo Pereira dos Santos", "Dalton", "Pedro", "João Paulo"],
  20: ["Danilo Pereira dos Santos", "Eduardo Lima", "Geraldo"],
  21: ["Matheus Senhorinho", "Ricardo Lima", "Victor Costa"],
  22: ["Wilson Ramos", "Pedro"],
  23: ["Miranda", "Dalton", "Eduardo Lima"],
  24: ["Lucas Trindade", "Danilo Pereira dos Santos", "João Paulo"],
  25: ["Matheus Senhorinho", "Ricardo Lima", "Miranda", "Geraldo", "Victor Costa"],
  26: ["Matheus Senhorinho", "Ricardo Lima", "Miranda", "Geraldo", "Victor Costa"],
  27: ["Pedro"],
  28: ["Wilson Ramos"],
  29: ["Dalton", "Eduardo Lima"],
  30: ["Lucas Trindade", "Danilo Pereira dos Santos", "João Paulo"],
  31: ["João Paulo"]
};

const folgasPorDiaAgosto = {
  1: ["Lucas Trindade", "Wilson Ramos", "Ricardo Lima", "Danilo Pereira dos Santos", "Eduardo Lima", "Miranda"],
  2: ["Matheus Senhorinho", "Wilson Ramos", "Pedro", "Eduardo Lima", "João Paulo", "Victor Costa"],
  3: ["Matheus Senhorinho", "Wilson Ramos", "Miranda", "Mateus Santos"],
  4: ["Ricardo Lima", "Dalton"],
  5: ["Lucas Trindade", "Pedro", "Mateus Santos"],
  6: ["Matheus Senhorinho", "João Paulo", "Geraldo"],
  7: ["Danilo Pereira dos Santos", "Eduardo Lima", "Geraldo", "Victor Costa"],
  8: ["Lucas Trindade", "Wilson Ramos", "Dalton"],
  9: ["Lucas Trindade", "Wilson Ramos", "Ricardo Lima", "Danilo Pereira dos Santos", "Dalton"],
  10: ["Ricardo Lima", "Danilo Pereira dos Santos", "Victor Costa"],
  11: ["Pedro", "João Paulo", "Geraldo", "Mateus Santos"],
  12: ["Matheus Senhorinho", "Dalton", "Eduardo Lima"],
  13: ["Wilson Ramos", "Danilo Pereira dos Santos", "Eduardo Lima"],
  14: ["Lucas Trindade", "Ricardo Lima"],
  15: ["João Paulo", "Geraldo", "Mateus Santos", "Victor Costa"],
  16: ["Eduardo Lima", "João Paulo", "Geraldo", "Mateus Santos", "Victor Costa"],
  17: ["Lucas Trindade", "Pedro"],
  18: ["Matheus Senhorinho", "Danilo Pereira dos Santos", "Dalton"],
  19: ["Wilson Ramos", "Geraldo"],
  20: ["Ricardo Lima", "João Paulo", "Mateus Santos"],
  21: ["Eduardo Lima", "Mateus Santos", "Victor Costa"],
  22: ["Lucas Trindade", "Matheus Senhorinho", "Pedro"],
  23: ["Matheus Senhorinho", "Danilo Pereira dos Santos", "Pedro"],
  24: ["Danilo Pereira dos Santos", "Dalton"],
  25: ["Ricardo Lima", "João Paulo", "Geraldo"],
  26: ["Wilson Ramos", "João Paulo", "Victor Costa"],
  27: ["Danilo Pereira dos Santos", "Eduardo Lima", "Mateus Santos", "Victor Costa"],
  28: ["Matheus Senhorinho", "Pedro"],
  29: ["Lucas Trindade", "Ricardo Lima", "Dalton"],
  30: ["Lucas Trindade", "Wilson Ramos", "Ricardo Lima", "Dalton"],
  31: ["João Paulo", "Geraldo"]
};

const folgasPorDiaSetembro = {
  1: ["Danilo Pereira dos Santos", "Miranda", "Jose Ramos"],
  2: ["Dalton", "Pedro", "Eduardo Lima", "Victor Costa"],
  3: ["Matheus Senhorinho", "Dalton"],
  4: ["Lucas Trindade", "Ricardo Lima", "Geraldo"],
  5: ["Wilson Ramos", "Danilo Pereira dos Santos", "Eduardo Lima", "João Paulo", "Jose Ramos"],
  6: ["Wilson Ramos", "Danilo Pereira dos Santos", "Eduardo Lima", "João Paulo"],
  7: ["Miranda", "Pedro", "Victor Costa"],
  8: ["Ricardo Lima", "Dalton", "Victor Costa"],
  9: ["Matheus Senhorinho", "Eduardo Lima", "Jose Ramos"],
  10: ["Lucas Trindade", "Wilson Ramos", "Miranda", "João Paulo"],
  11: ["Victor Costa"],
  12: ["Matheus Senhorinho", "Dalton", "Pedro", "Geraldo"],
  13: ["Matheus Senhorinho", "Danilo Pereira dos Santos", "Dalton", "Pedro", "Geraldo"],
  14: ["Ricardo Lima", "Jose Ramos"],
  15: ["Miranda", "Eduardo Lima", "Jose Ramos"],
  16: ["Lucas Trindade", "Victor Costa"],
  17: ["Wilson Ramos", "João Paulo"],
  18: ["Danilo Pereira dos Santos", "Dalton", "Pedro"],
  19: ["Matheus Senhorinho", "Miranda", "Geraldo", "Jose Ramos"],
  20: ["Lucas Trindade", "Matheus Senhorinho", "Ricardo Lima", "Danilo Pereira dos Santos", "Miranda", "Geraldo", "Jose Ramos"],
  21: ["Ricardo Lima", "Danilo Pereira dos Santos", "Eduardo Lima"],
  22: ["Lucas Trindade", "Pedro", "João Paulo", "Victor Costa"],
  23: ["Lucas Trindade", "Pedro", "Jose Ramos"],
  24: ["Wilson Ramos", "Dalton"],
  25: ["Matheus Senhorinho", "Ricardo Lima", "Danilo Pereira dos Santos"],
  26: ["Wilson Ramos", "Miranda", "Eduardo Lima", "João Paulo"],
  27: ["Lucas Trindade", "Wilson Ramos", "Miranda", "Eduardo Lima", "João Paulo", "Victor Costa"],
  28: ["Lucas Trindade", "Pedro", "Victor Costa"],
  29: ["Ricardo Lima", "Geraldo"],
  30: ["Ricardo Lima", "Dalton"]
};

const escalaManualJulho = {
  1: { G6: "Lucas Trindade", G8: "Matheus Senhorinho", G5: "Ricardo Lima", G2: "Victor Costa", G1: "Eric da Conceição", R1: "Danilo Pereira dos Santos", R2: "Miranda", G10: "Pedro", G11: "João Paulo", G13: "Fechada", G12: "Geraldo" },
  4: { G6: "João Paulo", G8: "Danilo Pereira dos Santos", G5: "Lucas Trindade", G2: "Miranda", G1: "Ricardo Lima", R1: "Wilson Ramos", R2: "Matheus Senhorinho", G10: "Fechada", G11: "Fechada", G13: "Mateus Santos", G12: "Geraldo" },
  5: { G6: "Wilson Ramos", G8: "Geraldo", G5: "Matheus Senhorinho", G2: "Danilo Pereira dos Santos", G1: "Lucas Trindade", R1: "Miranda", R2: "João Paulo", G10: "Fechada", G11: "Pedro", G13: "Mateus Santos", G12: "Fechada" }
};

const mesesDisponiveis = {
  julho: {
    label: "Julho 2026",
    ano: 2026,
    mes: 6,
    folgasPorDia,
    escalaManual: escalaManualJulho,
    inativos: [],
    postosInativos: [],
    observacoes: {}
  },
  agosto: {
    label: "Agosto 2026",
    ano: 2026,
    mes: 7,
    folgasPorDia: folgasPorDiaAgosto,
    escalaManual: {},
    inativos: [],
    postosInativos: [],
    observacoes: {}
  },
  setembro: {
    label: "Setembro 2026",
    ano: 2026,
    mes: 8,
    folgasPorDia: folgasPorDiaSetembro,
    escalaManual: {},
    inativos: ["Eric da Conceição", "Mateus Santos"],
    postosInativos: ["G11", "G12"],
    observacoes: {}
  }
};

let escala = {};
let contagem = {};
let diaAtual = 1;
let statusPresenca = {};
let mesSelecionado = "setembro";

function normalizarNome(nome) {
  if (!nome) return nome;
  return String(nome)
    .replace(/khauan\s+santos/i, "Miranda")
    .replace(/kauan\s+santos/i, "Miranda")
    .replace(/kau[aã]\s+geraldo(?:\s+dos)?\s+santos/i, "Geraldo")
    .replace(/erick\s+da\s+conceição/i, "Eric da Conceição")
    .replace(/danilo\s+pereira\s+do\s+santos/i, "Danilo Pereira dos Santos")
    .replace(/jos[eé]\s+ramos/i, "Jose Ramos");
}

function confirmarChegada(posto) {
  if (!statusPresenca[diaAtual]) statusPresenca[diaAtual] = {};
  statusPresenca[diaAtual][posto] = "chegou";
  mostrarDia(diaAtual);
}

function iniciarContagem() {
  funcionarios.forEach(nome => {
    contagem[nome] = {};
    postos.forEach(posto => contagem[nome][posto] = 0);
    contagem[nome].fortes = 0;
    contagem[nome].total = 0;
  });
}

function gerarEscala(mesKey = mesSelecionado) {
  const configMes = mesesDisponiveis[mesKey];
  if (!configMes) return;
  const totalDias = new Date(configMes.ano, configMes.mes + 1, 0).getDate();
  const listaInativos = configMes.inativos || [];
  const postosInativos = configMes.postosInativos || [];

  iniciarContagem();
  escala = {};

  for (let dia = 1; dia <= totalDias; dia++) {
    escala[dia] = {};
    const folgas = (configMes.folgasPorDia[dia] || []).map(normalizarNome);

    if (mesKey === "agosto" && dia >= 3 && !folgas.includes("Miranda")) {
      folgas.push("Miranda");
    }

    if (configMes.escalaManual && configMes.escalaManual[dia]) {
      escala[dia] = { ...configMes.escalaManual[dia], folgas };
      registrarContagem(dia);
      continue;
    }

    let disponiveis = funcionarios.filter(nome => !folgas.includes(nome) && !listaInativos.includes(nome));

    postos.forEach(posto => {
      if (postosInativos.includes(posto)) {
        escala[dia][posto] = "Fechada";
        return;
      }

      if (disponiveis.length === 0) {
        escala[dia][posto] = "SEM COBERTURA";
        return;
      }

      const escolhido = escolherMelhorFuncionario(disponiveis, posto);
      escala[dia][posto] = escolhido;

      contagem[escolhido][posto]++;
      contagem[escolhido].total++;

      if (fortes.includes(posto)) contagem[escolhido].fortes++;

      disponiveis = disponiveis.filter(nome => nome !== escolhido);
    });

    escala[dia].folgas = folgas;
  }
}

function escolherMelhorFuncionario(lista, posto) {
  return lista.sort((a, b) => {
    if (contagem[a][posto] !== contagem[b][posto]) {
      return contagem[a][posto] - contagem[b][posto];
    }
    if (fortes.includes(posto)) {
      if (contagem[a].fortes !== contagem[b].fortes) {
        return contagem[a].fortes - contagem[b].fortes;
      }
    }
    return contagem[a].total - contagem[b].total;
  })[0];
}

function registrarContagem(dia) {
  postos.forEach(posto => {
    const nome = escala[dia][posto];
    if (funcionarios.includes(nome)) {
      contagem[nome][posto]++;
      contagem[nome].total++;
      if (fortes.includes(posto)) contagem[nome].fortes++;
    }
  });
}

function editarDia(dia) {
  if (!usuarioAdmin) return;
  const resultado = document.getElementById("resultado");
  if (!resultado) return;
  
  const escalaDia = escala[dia];
  const configMes = mesesDisponiveis[mesSelecionado];
  const listaInativos = configMes.inativos || [];
  const ativos = funcionarios.filter(nome => !listaInativos.includes(nome));
  const opcoes = ["Fechada", ...ativos];

  resultado.insertAdjacentHTML("afterbegin", `
    <form class="editor-dia" onsubmit="salvarEdicaoDia(event, ${dia})">
      <h3>Editar escala deste dia</h3>
      <div class="editor-grid">
        ${postos.map(posto => `
          <label>
            <span>${posto}</span>
            <select name="${posto}" required>
              ${opcoes.map(nome => `<option value="${nome}" ${escalaDia[posto] === nome ? "selected" : ""}>${nome}</option>`).join("")}
            </select>
          </label>
        `).join("")}
      </div>
      <div class="editor-acoes">
        <button class="btn-cheguei" type="submit">Salvar alteração</button>
        <button class="ghost-btn" type="button" onclick="mostrarDia(${dia})">Cancelar</button>
      </div>
    </form>
  `);
}

async function salvarEdicaoDia(event, dia) {
  event.preventDefault();
  if (!usuarioAdmin || !supabaseClient) return;

  const dados = new FormData(event.currentTarget);
  const escalaManual = {};

  postos.forEach(posto => {
    escalaManual[posto] = dados.get(posto);
  });

  const status = document.getElementById("loginStatus");
  if(status) status.textContent = "Salvando alteração...";

  const { error } = await supabaseClient
    .from("escala_edicoes")
    .upsert({ mes: mesSelecionado, dia, escala: escalaManual }, { onConflict: "mes,dia" });

  if (error) {
    if(status) status.textContent = "Não foi possível salvar. Verifique a tabela no Supabase.";
    console.error(error);
    return;
  }

  mesesDisponiveis[mesSelecionado].escalaManual[dia] = escalaManual;
  gerarEscala(mesSelecionado);
  renderizarResumos();
  mostrarDia(dia);
  if(status) status.textContent = `Administrador conectado: ${usuarioAdmin.email}`;
}

function criarBotoesDias() {
  const diasDiv = document.getElementById("dias");
  if (!diasDiv) return;
  diasDiv.innerHTML = "";

  const configMes = mesesDisponiveis[mesSelecionado];
  const totalDias = new Date(configMes.ano, configMes.mes + 1, 0).getDate();
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  for (let dia = 1; dia <= totalDias; dia++) {
    const data = new Date(configMes.ano, configMes.mes, dia);
    const nomeSemana = diasSemana[data.getDay()];

    const botao = document.createElement("button");
    botao.innerHTML = `
      <strong>${String(dia).padStart(2, "0")}</strong>
      <small>${nomeSemana}</small>
      <small>${String(dia).padStart(2, "0")}/${String(configMes.mes + 1).padStart(2, "0")}</small>
    `;
    botao.dataset.dia = String(dia);
    botao.onclick = () => mostrarDia(dia);
    diasDiv.appendChild(botao);
  }

  atualizarBotoesDias();
}

function atualizarBotoesDias() {
  const botoes = document.querySelectorAll(".dias button");
  botoes.forEach(botao => {
    const dia = Number(botao.dataset.dia);
    const eMesAtual = mesesDisponiveis[mesSelecionado].mes === hojeData.getMonth();
    botao.classList.toggle("active", dia === diaSelecionado);
    botao.classList.toggle("today", dia === hoje && eMesAtual);
    botao.setAttribute("aria-pressed", dia === diaSelecionado ? "true" : "false");
  });
}

function mostrarDia(dia) {
  diaAtual = dia;
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("titulo-dia");
  diaSelecionado = dia;

  if (!resultado || !titulo || !escala[dia]) return;

  const configMes = mesesDisponiveis[mesSelecionado];
  const mesNumero = String(configMes.mes + 1).padStart(2, "0");
  titulo.textContent = `Escala do dia ${String(dia).padStart(2, "0")}/${mesNumero}/${configMes.ano}`;

  const folgas = escala[dia].folgas || [];
  const postosFortes = Object.entries(escala[dia]).filter(([posto, pessoa]) => fortes.includes(posto) && pessoa && pessoa !== "SEM COBERTURA" && pessoa !== "Fechada").length;
  const postosOcupados = Object.entries(escala[dia]).filter(([posto, pessoa]) => postos.includes(posto) && pessoa && pessoa !== "SEM COBERTURA" && pessoa !== "Fechada").length;
  const semCobertura = Object.entries(escala[dia]).filter(([posto, pessoa]) => postos.includes(posto) && pessoa === "SEM COBERTURA").length;
  const observacoes = mesSelecionado === "agosto" && dia >= 3 ? ["Miranda em férias a partir do dia 3."] : [];

  const rDia = document.getElementById("resumoDia");
  const rFolgas = document.getElementById("resumoFolgas");
  const rPostos = document.getElementById("resumoPostos");
  const rOcupados = document.getElementById("resumoOcupados");
  const rSem = document.getElementById("resumoSemCobertura");

  if(rDia) rDia.textContent = String(dia).padStart(2, "0");
  if(rFolgas) rFolgas.textContent = folgas.length;
  if(rPostos) rPostos.textContent = postosFortes;
  if(rOcupados) rOcupados.textContent = postosOcupados;
  if(rSem) rSem.textContent = semCobertura;
  
  atualizarBotoesDias();

  let html = `<div class="painel-dia">`;
  html += `<button class="ghost-btn editar-dia-btn" type="button" onclick="editarDia(${dia})" ${usuarioAdmin ? "" : "hidden"}>Editar este dia</button>`;

  Object.keys(gruposPostos).forEach(tituloGrupo => {
    html += `<h3>${tituloGrupo}</h3><div class="cards-grid">`;

    gruposPostos[tituloGrupo].forEach(posto => {
      const pessoa = escala[dia][posto] || "SEM COBERTURA";
      const fechada = pessoa === "SEM COBERTURA" || pessoa === "Fechada";

      html += `
        <div class="posto-card ${classePosto(posto)} ${fechada ? "fechada" : ""} ${statusPresenca[diaAtual]?.[posto] === "chegou" ? "confirmado" : ""}">
          <div class="posto-nome">${posto}</div>
          <div class="posto-pessoa">${fechada ? "FECHADA / SEM COBERTURA" : pessoa}</div>

${
  fortes.includes(posto) && !fechada
    ? `<button class="btn-cheguei" onclick="confirmarChegada('${posto}')">
        ${statusPresenca[diaAtual]?.[posto] === "chegou" ? "✅ Confirmado" : "Confirmar chegada"}
      </button>`
    : ""
}
        </div>
      `;
    });

    html += `</div>`;
  });

  html += `
    <h3>🏖️ Folgas</h3>
    <div class="folgas-box">
      ${
        folgas.length
          ? folgas.map(nome => `<span>${nome}</span>`).join("")
          : "<span>Ninguém de folga</span>"
      }
    </div>
  `;

  if (observacoes.length) {
    html += `<div class="observacoes-box"><strong>Observação:</strong> ${observacoes.join(" ")}</div>`;
  }

  html += `</div>`;
  resultado.innerHTML = html;
}

function preencherFuncionarios() {
  const select = document.getElementById("funcionarioSelect");
  const busca = document.getElementById("funcionarioBusca");
  const resumo = document.getElementById("resumoFuncionarios");

  if (!select) return;

  const configMes = mesesDisponiveis[mesSelecionado];
  const listaInativos = configMes.inativos || [];
  const ativos = funcionarios.filter(nome => !listaInativos.includes(nome));

  select.innerHTML = `<option value="">Selecione o funcionário</option>`;
  ativos.forEach(nome => {
    const option = document.createElement("option");
    option.value = nome;
    option.textContent = nome;
    select.appendChild(option);
  });

  if(resumo) resumo.textContent = ativos.length;

  select.addEventListener("change", () => mostrarFuncionario(select.value));
  if(busca) busca.addEventListener("input", () => filtrarFuncionarios(select, busca));
}

function filtrarFuncionarios(select, busca) {
  const termo = busca.value.trim().toLowerCase();
  let algumVisivel = false;

  Array.from(select.options).forEach(option => {
    if (!option.value) {
      option.hidden = false;
      return;
    }

    const corresponde = option.text.toLowerCase().includes(termo);
    option.hidden = !corresponde;
    algumVisivel = algumVisivel || corresponde;
  });

  if (!select.value || select.options[select.selectedIndex]?.hidden) {
    const primeiroVisivel = Array.from(select.options).find(option => option.value && !option.hidden);
    if (primeiroVisivel) {
      select.value = primeiroVisivel.value;
      mostrarFuncionario(primeiroVisivel.value);
    } else {
      mostrarFuncionario("");
    }
  } else if (algumVisivel) {
    mostrarFuncionario(select.value);
  }
}

function mostrarFuncionario(nome) {
  const div = document.getElementById("resultadoFuncionario");
  if (!div) return;

  const configMes = mesesDisponiveis[mesSelecionado];
  const totalDias = new Date(configMes.ano, configMes.mes + 1, 0).getDate();
  const mesNumero = String(configMes.mes + 1).padStart(2, "0");
  const listaInativos = configMes.inativos || [];

  if (!nome) {
    div.innerHTML = '<div class="funcionario"><p>Digite ou selecione um funcionário para visualizar o mês.</p></div>';
    return;
  }

  let html = `<div class="funcionario"><strong>${nome}</strong><br><br>`;

  for (let dia = 1; dia <= totalDias; dia++) {
    let postoDoFuncionario = "Folga";

    if (listaInativos.includes(nome)) {
       postoDoFuncionario = "Inativo/Férias";
    } else if (escala[dia] && !escala[dia].folgas.includes(nome)) {
      postoDoFuncionario = postos.find(posto => escala[dia][posto] === nome) || "Apoio";
    }

    html += `${String(dia).padStart(2, "0")}/${mesNumero} - <span class="${classePosto(postoDoFuncionario)}">${postoDoFuncionario}</span><br>`;
  }

  html += "</div>";
  div.innerHTML = html;
}

function mostrarResumoFolgas() {
  const main = document.querySelector("main");
  if(!main) return;

  let html = `
    <section class="card resumo-mes-section">
      <h2>Resumo do mês</h2>
      <table>
        <tr>
          <th>Funcionário</th>
          <th>Trabalhados</th>
          <th>Folgas</th>
        </tr>
  `;

  const configMes = mesesDisponiveis[mesSelecionado];
  const totalDias = new Date(configMes.ano, configMes.mes + 1, 0).getDate();
  const listaInativos = configMes.inativos || [];
  
  // Oculta os funcionários inativos da lista de resumo
  const ativos = funcionarios.filter(nome => !listaInativos.includes(nome));

  ativos.forEach(nome => {
    let folgas = 0;
    let trabalhados = 0;

    for (let dia = 1; dia <= totalDias; dia++) {
      if (escala[dia] && escala[dia].folgas.includes(nome)) {
         folgas++;
      } else {
         trabalhados++;
      }
    }

    html += `
      <tr>
        <td>${nome}</td>
        <td>${trabalhados}</td>
        <td class="folga">${folgas}</td>
      </tr>
    `;
  });

  html += `</table></section>`;
  main.insertAdjacentHTML("beforeend", html);
}

function mostrarResumoMaquinas() {
  const main = document.querySelector("main");
  if(!main) return;

  let html = `
    <section class="card resumo-mes-section">
      <h2>Quantidade por máquina</h2>
      <table>
        <tr>
          <th>Funcionário</th>
  `;

  postos.forEach(posto => {
    html += `<th>${posto}</th>`;
  });

  html += `<th>Prioridade</th></tr>`;

  const configMes = mesesDisponiveis[mesSelecionado];
  const totalDias = new Date(configMes.ano, configMes.mes + 1, 0).getDate();
  const listaInativos = configMes.inativos || [];
  
  // Oculta os funcionários inativos da lista de máquinas
  const ativos = funcionarios.filter(nome => !listaInativos.includes(nome));

  ativos.forEach(nome => {
    html += `<tr><td>${nome}</td>`;

    postos.forEach(posto => {
      let qtd = 0;
      for (let dia = 1; dia <= totalDias; dia++) {
        if (escala[dia] && escala[dia][posto] === nome) qtd++;
      }
      html += `<td>${qtd}</td>`;
    });

    let totalFortes = 0;
    for (let dia = 1; dia <= totalDias; dia++) {
      fortes.forEach(posto => {
        if (escala[dia] && escala[dia][posto] === nome) totalFortes++;
      });
    }

    html += `<td class="forte">${totalFortes}</td></tr>`;
  });

  html += `</table></section>`;
  main.insertAdjacentHTML("beforeend", html);
}

function classePosto(posto) {
  if (posto === "Folga" || posto === "F" || posto === "Inativo/Férias") return "folga";
  if (posto === "R1" || posto === "R2") return "rendicao";
  if (fortes.includes(posto)) return "forte";
  return "maquina";
}

function preencherMetas() {
  const tbody = document.getElementById("metas-body");
  if (tbody) {
    tbody.innerHTML = metas
      .map(linha => `<tr>${linha.map(valor => `<td>${valor}</td>`).join("")}</tr>`)
      .join("");
  }
}

function renderizarResumos() {
  document.querySelectorAll(".resumo-mes-section").forEach(secao => secao.remove());
  mostrarResumoFolgas();
  mostrarResumoMaquinas();
}

function configurarSelectorMes() {
  const botao = document.getElementById("botaoMes");
  const menu = document.getElementById("menuMes");
  const select = document.getElementById("mesSelect");

  if (select) {
    select.innerHTML = Object.keys(mesesDisponiveis)
      .map(key => `<option value="${key}">${mesesDisponiveis[key].label}</option>`)
      .join("");

    select.addEventListener("change", () => {
      mesSelecionado = select.value;
      if (menu) menu.hidden = true;
      if (botao) botao.textContent = `Mês: ${mesesDisponiveis[mesSelecionado].label}`;
      gerarEscala(mesSelecionado);
      criarBotoesDias();
      preencherFuncionarios();
      mostrarDia(obterDiaParaMostrar());
      renderizarResumos();
    });

    select.value = mesSelecionado;
  }

  if (botao && menu) {
    botao.addEventListener("click", () => {
      menu.hidden = !menu.hidden;
    });
    botao.textContent = `Mês: ${mesesDisponiveis[mesSelecionado].label}`;
  }
}

async function inicializarPagina() {
  try {
    await carregarEdicoesSalvas();
    gerarEscala();
    criarBotoesDias();
    preencherFuncionarios();
    configurarSelectorMes();
    preencherMetas();
    mostrarDia(obterDiaParaMostrar());
    renderizarResumos();
    await iniciarAutenticacao();
  } catch (erro) {
    console.error("Erro no JavaScript:", erro);
    alert("Ops! Alguma função travou: " + erro.message + "\n\nAperte F12 e olhe a aba Console para mais detalhes.");
  }
}

inicializarPagina();

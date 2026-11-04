/* Dados estáticos e cálculos — Eu Amo Esoterismo */
/* ---------- Ícones ---------- */
const I = {
  moon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  cards:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="3" width="12" height="17" rx="2"/><path d="M5 6.5 3.5 7l3.6 13.5 6-1.6"/><path d="m13 9 1.2 2.4 2.6.4-1.9 1.8.5 2.6L13 15l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z"/></svg>',
  num:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="4" r="2"/><circle cx="6" cy="9" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="6" cy="16" r="2"/><circle cx="18" cy="16" r="2"/><circle cx="12" cy="20" r="2"/><path d="M12 6v12M8 9h8M8 16h8M7.5 10.5l3 8M16.5 10.5l-3 8"/></svg>',
  zodiac:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9"/></svg>',
  user:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  star:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-2.8z"/></svg>',
  ig:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  fb:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>'
};
const AVATARS = {
  lua:'<svg viewBox="0 0 48 48" width="60%" fill="none" stroke="currentColor" stroke-width="2"><path d="M34 30A14 14 0 1 1 18 10a11 11 0 0 0 16 20z"/></svg>',
  sol:'<svg viewBox="0 0 48 48" width="60%" fill="none" stroke="currentColor" stroke-width="2"><circle cx="24" cy="24" r="8"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4"/></svg>',
  olho:'<svg viewBox="0 0 48 48" width="62%" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 24s7-11 18-11 18 11 18 11-7 11-18 11S6 24 6 24z"/><circle cx="24" cy="24" r="5"/><path d="M24 4v5M14 6l2 4M34 6l-2 4"/></svg>',
  estrela:'<svg viewBox="0 0 48 48" width="58%" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 6l5 13h13l-10.5 8 4 13L24 32l-11.5 8 4-13L6 19h13z"/></svg>',
  cristal:'<svg viewBox="0 0 48 48" width="56%" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 4l10 12-10 28-10-28z"/><path d="M14 16h20M24 4v40"/></svg>',
  lotus:'<svg viewBox="0 0 48 48" width="64%" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 36c-6-4-8-12 0-22 8 10 6 18 0 22z"/><path d="M24 36c-8 1-14-4-15-12 7-1 12 3 15 12zM24 36c8 1 14-4 15-12-7-1-12 3-15 12z"/><path d="M8 40h32"/></svg>'
};

/* ---------- Dados ---------- */
const ARCANOS = [
 ["0","O Louco","Novos começos, liberdade e confiança no desconhecido.","Imprudência, medo de arriscar ou falta de direção."],
 ["I","O Mago","Você tem os recursos e o talento para realizar o que deseja.","Energia dispersa, manipulação ou potencial não usado."],
 ["II","A Sacerdotisa","Ouça a intuição; a resposta está no silêncio.","Segredos, desconexão interior ou dúvidas não ditas."],
 ["III","A Imperatriz","Abundância, criatividade e cuidado florescendo.","Bloqueio criativo ou dependência emocional."],
 ["IV","O Imperador","Estrutura, disciplina e liderança firme.","Rigidez, controle excessivo ou autoridade questionada."],
 ["V","O Hierofante","Tradição, aprendizado e orientação de alguém sábio.","Quebra de regras, busca por um caminho próprio."],
 ["VI","Os Enamorados","Escolhas do coração, união e alinhamento de valores.","Indecisão, desequilíbrio ou escolha adiada."],
 ["VII","O Carro","Vitória pelo foco e pela determinação.","Falta de rumo ou forças puxando em sentidos opostos."],
 ["VIII","A Força","Coragem gentil e domínio das próprias emoções.","Insegurança, impaciência ou autocrítica."],
 ["IX","O Eremita","Momento de introspecção e busca de sabedoria interior.","Isolamento excessivo ou fuga de si mesmo."],
 ["X","A Roda da Fortuna","Ciclos mudando a seu favor; o destino se move.","Resistência à mudança ou maré passageira desfavorável."],
 ["XI","A Justiça","Equilíbrio, verdade e consequências justas.","Injustiça, desonestidade ou decisão desequilibrada."],
 ["XII","O Enforcado","Pausa necessária; ver a situação por outro ângulo.","Estagnação, sacrifício sem propósito."],
 ["XIII","A Morte","Fim de um ciclo e transformação profunda.","Apego ao passado, medo de mudar."],
 ["XIV","A Temperança","Paciência, harmonia e o caminho do meio.","Excessos, pressa ou desequilíbrio."],
 ["XV","O Diabo","Atenção a apegos, vícios e padrões que prendem.","Libertação de amarras e retomada do poder pessoal."],
 ["XVI","A Torre","Mudança súbita que derruba o que não era sólido.","Crise evitada ou mudança adiada."],
 ["XVII","A Estrela","Esperança, cura e inspiração renovada.","Desânimo ou fé momentaneamente abalada."],
 ["XVIII","A Lua","Intuição e sonhos; nem tudo é o que parece.","Confusão se dissipando, verdades vindo à tona."],
 ["XIX","O Sol","Alegria, sucesso e clareza.","Otimismo exagerado ou sucesso adiado."],
 ["XX","O Julgamento","Despertar, renascimento e um chamado interior.","Autodúvida, culpa ou chamado ignorado."],
 ["XXI","O Mundo","Realização, conclusão e plenitude.","Ciclo incompleto, falta de fechamento."]
];
/* Tabela cabalística (alfabeto hebraico adaptado ao latino) */
const CABALA={A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:6,Y:1,Z:7};
const NUM_TXT={
 1:["Liderança","Pioneirismo, independência e coragem para começar."],
 2:["Cooperação","Sensibilidade, diplomacia e talento para unir pessoas."],
 3:["Expressão","Criatividade, comunicação e alegria de viver."],
 4:["Construção","Trabalho, método e segurança construída passo a passo."],
 5:["Liberdade","Mudança, curiosidade e adaptação ao novo."],
 6:["Harmonia","Amor, família, responsabilidade e beleza."],
 7:["Sabedoria","Espiritualidade, estudo e busca da verdade interior."],
 8:["Realização","Poder material, ambição e justiça."],
 9:["Humanidade","Compaixão, generosidade e conclusão de ciclos."],
 11:["Mestre da Intuição","Número mestre: inspiração, visão espiritual e sensibilidade elevada."],
 22:["Mestre Construtor","Número mestre: capacidade de materializar grandes ideais."]
};
const SIGNOS=[
 ["Áries","♈","21/03 – 19/04","Fogo","Marte",[3,21],[4,19]],
 ["Touro","♉","20/04 – 20/05","Terra","Vênus",[4,20],[5,20]],
 ["Gêmeos","♊","21/05 – 20/06","Ar","Mercúrio",[5,21],[6,20]],
 ["Câncer","♋","21/06 – 22/07","Água","Lua",[6,21],[7,22]],
 ["Leão","♌","23/07 – 22/08","Fogo","Sol",[7,23],[8,22]],
 ["Virgem","♍","23/08 – 22/09","Terra","Mercúrio",[8,23],[9,22]],
 ["Libra","♎","23/09 – 22/10","Ar","Vênus",[9,23],[10,22]],
 ["Escorpião","♏","23/10 – 21/11","Água","Plutão",[10,23],[11,21]],
 ["Sagitário","♐","22/11 – 21/12","Fogo","Júpiter",[11,22],[12,21]],
 ["Capricórnio","♑","22/12 – 19/01","Terra","Saturno",[12,22],[1,19]],
 ["Aquário","♒","20/01 – 18/02","Ar","Urano",[1,20],[2,18]],
 ["Peixes","♓","19/02 – 20/03","Água","Netuno",[2,19],[3,20]]
];
const PREV={
 amor:["Um diálogo sincero aproxima quem você ama.","Dia favorável para demonstrar carinho em pequenos gestos.","Evite cobranças; a leveza atrai mais do que a insistência.","Alguém do passado pode reaparecer. Observe antes de agir.","Boa fase para conhecer pessoas em ambientes de estudo ou espiritualidade.","Cuide da sua autoestima: o amor começa em você.","A Lua favorece reconciliações e conversas profundas."],
 trabalho:["Uma ideia antiga pode finalmente sair do papel.","Organize prioridades: menos tarefas, mais resultado.","Bom momento para negociar valores e prazos.","Parcerias trazem oportunidades inesperadas.","Evite decisões financeiras por impulso hoje.","Seu esforço será notado por quem decide.","Estude algo novo; o conhecimento abre portas em breve."],
 energia:["Reserve um tempo para silêncio e respiração consciente.","Movimente o corpo: a energia parada pesa no humor.","Banho de ervas ou incenso ajudam a limpar o ambiente.","Durma mais cedo; os sonhos trarão mensagens.","Contato com a natureza recarrega suas forças.","Afaste-se de conversas negativas e preserve sua vibração.","Gratidão hoje multiplica as boas energias da semana."]
};

/* ---------- Numerologia ---------- */
const strip=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase();
function reduce(n){while(n>9&&n!==11&&n!==22){n=String(n).split("").reduce((a,b)=>a+ +b,0)}return n}
function numerologia(nome,nasc){
  const clean=strip(nome).replace(/[^A-Z ]/g,"").replace(/\s+/g," ").trim();
  const letters=[...clean].map(c=>c===" "?{c:" "}:{c,v:CABALA[c]||0,vog:"AEIOUY".includes(c)});
  const sum=f=>letters.filter(l=>l.v&&f(l)).reduce((a,l)=>a+l.v,0);
  const expressao=reduce(sum(()=>true)), motivacao=reduce(sum(l=>l.vog)), impressao=reduce(sum(l=>!l.vog));
  const [y,m,d]=nasc.split("-").map(Number);
  const destino=reduce(reduce(d)+reduce(m)+reduce(String(y).split("").reduce((a,b)=>a+ +b,0)));
  const missao=reduce(expressao+destino);
  return {letters,expressao,motivacao,impressao,destino,missao,diaNatalicio:reduce(d),criadoEm:new Date().toISOString()};
}
function signoDe(nasc){if(!nasc)return null;const [,m,d]=nasc.split("-").map(Number);
  return SIGNOS.findIndex(s=>{const [sm,sd]=s[5],[em,ed]=s[6];return sm<=em?((m===sm&&d>=sd)||(m===em&&d<=ed)||(m>sm&&m<em)):((m===sm&&d>=sd)||(m===em&&d<=ed))})}
function seeded(seed){let h=2166136261;for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return ((h>>>0)%10000)/10000}}


/* Mensagens de cada Arcano: [o que a carta diz, como vai ser, como vai ser (invertida), conforto] */
const MENSAGENS = [
 ["O Louco chega para lembrar que todo caminho bonito começa com um primeiro passo, mesmo sem ver o fim da estrada.",
  "Uma fase nova se abre. Portas inesperadas aparecem quando você se permite ir com leveza e curiosidade.",
  "Talvez o medo esteja segurando seus pés. Respire, planeje um pouco mais e logo você vai se sentir pronta para seguir.",
  "O universo protege quem caminha de coração aberto. Confie: o que vem pela frente é cheio de descobertas boas."],
 ["O Mago mostra que você já tem nas mãos tudo o que precisa para transformar sua realidade.",
  "Seus planos ganham força. O que você colocar intenção e ação agora tende a se concretizar rapidamente.",
  "Sua energia pode estar espalhada em muitas direções. Ao escolher um foco, o seu poder volta inteiro.",
  "Você é capaz, e as forças ao seu redor estão a seu favor. Acredite no seu talento, ele vai te levar longe."],
 ["A Sacerdotisa pede silêncio interior. A resposta que você procura já mora dentro de você.",
  "Algo será revelado no tempo certo. Sonhos, sinais e pressentimentos vão guiar suas próximas escolhas.",
  "Você pode estar ignorando o que sente. Reserve um momento só seu e a clareza vai voltar.",
  "Sua intuição é sagrada e nunca te abandona. Escute com carinho: ela está te levando para um lugar de paz."],
 ["A Imperatriz traz fertilidade, beleza e abundância. É tempo de florescer.",
  "Projetos, relações e sonhos crescem com cuidado e afeto. Prosperidade e conforto se aproximam.",
  "Talvez você esteja cuidando de todos e se esquecendo de si. Quando você se nutre, tudo ao redor floresce.",
  "A vida está preparando um jardim lindo para você. Tudo o que você plantou com amor vai dar frutos."],
 ["O Imperador fala de estrutura, firmeza e conquistas construídas com responsabilidade.",
  "Estabilidade chega. Decisões firmes e organização trazem segurança para você e para quem você ama.",
  "Rigidez ou controle podem estar pesando. Um pouco de flexibilidade vai abrir caminhos que pareciam fechados.",
  "Você tem força para sustentar seus sonhos. As bases que você está construindo agora vão durar."],
 ["O Hierofante traz sabedoria, bons conselhos e conexão com aquilo em que você acredita.",
  "Alguém experiente pode aparecer para orientar você. Aprendizados e compromissos importantes se firmam.",
  "Você pode estar se sentindo presa a regras que não fazem mais sentido. Tudo bem criar o seu próprio caminho.",
  "Você nunca caminha sozinha. Há proteção, bênçãos e sabedoria acompanhando cada passo seu."],
 ["Os Enamorados falam de amor, união e escolhas feitas com o coração.",
  "Uma decisão importante se aproxima, e ela vai alinhar sua vida com o que você realmente valoriza. O amor está em alta.",
  "Pode haver indecisão ou desencontro. Escolha o que respeita quem você é, e a harmonia vai voltar.",
  "Você merece um amor que acolhe e uma vida que combina com sua alma. Isso está vindo ao seu encontro."],
 ["O Carro anuncia vitória, movimento e avanço pela sua determinação.",
  "Você vai superar obstáculos e chegar aonde deseja. Viagens e mudanças positivas estão no caminho.",
  "Talvez você se sinta puxada para lados diferentes. Defina sua direção e o caminho se abre de novo.",
  "Nada vai te parar. Você está no comando, e a estrada à frente leva direto para suas conquistas."],
 ["A Força mostra coragem gentil: domar os desafios com amor, paciência e confiança.",
  "Você vai atravessar o que parece difícil com mais serenidade do que imagina. Sua força interior cresce.",
  "A insegurança pode estar falando alto. Seja gentil consigo mesma e sua coragem vai reaparecer.",
  "Você é muito mais forte do que pensa. Tudo o que você já superou prova que vai dar tudo certo."],
 ["O Eremita convida a uma pausa para olhar para dentro e encontrar sua própria luz.",
  "Um tempo de reflexão traz respostas profundas. Depois dele, você volta mais sábia e segura do que quer.",
  "O isolamento pode estar pesando. Deixe alguém querido se aproximar, você não precisa carregar tudo só.",
  "A luz que você procura está acesa dentro de você. Ela vai iluminar cada passo do seu caminho."],
 ["A Roda da Fortuna gira: os ciclos mudam e a sorte se move a seu favor.",
  "Mudanças positivas e oportunidades surpreendentes estão chegando. O momento ruim fica para trás.",
  "Uma maré difícil pode estar passando, mas a roda nunca para. Logo ela gira de novo para o seu lado.",
  "A vida está virando a página para você. Prepare-se, porque o próximo capítulo é de alegria."],
 ["A Justiça traz equilíbrio, verdade e a colheita justa de tudo o que você semeou.",
  "Situações pendentes se resolvem de forma justa. Decisões tomadas com honestidade trazem paz.",
  "Algo pode parecer injusto agora. Mantenha sua verdade, pois o equilíbrio sempre se restabelece.",
  "O universo vê o seu esforço e o seu coração bom. Tudo vai se acertar do jeito que precisa ser."],
 ["O Enforcado pede uma pausa e um novo olhar. Às vezes esperar é o movimento mais sábio.",
  "Uma mudança de perspectiva vai mostrar uma solução que antes você não via. A espera tem propósito.",
  "Você pode estar adiando algo por medo. Solte o que te prende e a vida volta a fluir.",
  "Nada está parado à toa. Este tempo está preparando algo bonito que logo vai se revelar."],
 ["A Morte, no tarô, é transformação: um ciclo se encerra para algo muito melhor nascer.",
  "O que já não serve vai embora, abrindo espaço para uma fase renovada e cheia de vida.",
  "Apegar-se ao passado pode estar doendo. Quando você solta, o novo encontra espaço para chegar.",
  "Todo fim traz um recomeço. Você está renascendo, e esta nova versão de você vai brilhar."],
 ["A Temperança traz harmonia, paciência e o equilíbrio perfeito entre as coisas.",
  "Com calma e moderação, tudo se encaixa. Relações se harmonizam e a saúde emocional se fortalece.",
  "A pressa ou os excessos podem estar te desequilibrando. Desacelere e o seu centro volta.",
  "Tudo está se ajustando no tempo certo. A paz que você deseja já está a caminho."],
 ["O Diabo mostra apegos e padrões que prendem, e lembra que a chave para sair está com você.",
  "Ao reconhecer o que te limita, você recupera seu poder. Uma libertação importante se aproxima.",
  "Você está se libertando de algo que pesava. Correntes estão se soltando, continue nesse caminho.",
  "Você tem o poder de escolher a sua liberdade. Dias mais leves e felizes estão logo ali."],
 ["A Torre anuncia mudanças rápidas que derrubam o que não era sólido, para algo verdadeiro surgir.",
  "Uma surpresa pode sacudir as coisas, mas ela abre espaço para uma vida mais autêntica e firme.",
  "Uma mudança pode estar sendo adiada. Encare com coragem, pois do outro lado há alívio.",
  "Mesmo quando tudo parece mudar de repente, você está sendo levada para algo mais seguro e verdadeiro."],
 ["A Estrela é esperança, cura e inspiração. Depois da tempestade, o céu se abre.",
  "Um período de renovação e sorte começa. Sonhos voltam a parecer possíveis e o coração se acalma.",
  "Se a fé estiver abalada, saiba que ela é uma chama que nunca se apaga. Logo ela volta a brilhar.",
  "Sua estrela está brilhando. O futuro guarda realizações lindas, e você merece cada uma delas."],
 ["A Lua fala de intuição, sonhos e mistérios. Nem tudo está visível ainda, e tudo bem.",
  "Aos poucos as coisas ficam claras. Confie no que sente: sua intuição vai mostrar o caminho certo.",
  "As dúvidas estão se dissipando. A verdade aparece e traz a tranquilidade que você esperava.",
  "Mesmo na noite mais escura, a Lua ilumina o caminho. Você está protegida e guiada."],
 ["O Sol é alegria, sucesso e vitalidade. Uma das cartas mais positivas do tarô.",
  "Dias felizes estão chegando: conquistas, reconhecimento e momentos de muita alegria.",
  "O sucesso pode estar demorando um pouco, mas ele vem. A luz já está nascendo no horizonte.",
  "O Sol brilha sobre a sua vida. Prepare o sorriso, porque o que vem por aí é lindo."],
 ["O Julgamento traz despertar, renovação e um chamado para viver o seu propósito.",
  "Você vai entender o sentido de tudo o que viveu. Uma nova fase, mais consciente e plena, começa.",
  "A culpa ou a autocrítica podem estar te segurando. Perdoe-se, você está pronta para recomeçar.",
  "Você está despertando para a sua melhor versão. O futuro te chama, e ele é cheio de luz."],
 ["O Mundo é realização, conclusão e plenitude. Um ciclo se completa com sucesso.",
  "Seus esforços são coroados. Conquistas, celebrações e a sensação de estar no lugar certo chegam.",
  "Falta só um pequeno passo para fechar esse ciclo. Termine com carinho e a recompensa vem.",
  "O mundo está se abrindo para você. Tudo o que você sonhou está mais perto do que imagina."]
];
const BENCAOS = [
  "Confie no tempo da vida: tudo está se encaminhando para o seu bem.",
  "O que é seu está guardado e vai chegar na hora certa.",
  "Respire fundo. Dias lindos estão vindo ao seu encontro.",
  "Você é luz, e a luz sempre encontra o seu caminho.",
  "O universo está conspirando a seu favor. Vai dar tudo certo.",
  "Cada passo seu está sendo guiado com amor.",
  "Acredite: o melhor ainda está por vir."
];

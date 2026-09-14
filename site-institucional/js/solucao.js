/* script solucao locallead */

export const initSolucao = () => {
  const etapas = document.querySelectorAll(".pipeline-item");

  const verificarScroll = () => {
    etapas.forEach((etapa) => {
      const posicaoTopo = etapa.getBoundingClientRect().top;
      const alturaGatilho = window.innerHeight * 0.85;

      // se o elemento aparecer na tela, adiciona a classe de visibilidade
      if (posicaoTopo < alturaGatilho) {
        etapa.classList.add("is-visible");
      }
    });
  };

  // ativa o efeito ao rolar a página e roda uma vez no início
  window.addEventListener("scroll", verificarScroll);
  verificarScroll();
};

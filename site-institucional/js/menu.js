/* script menu locallead */

export const initMenu = () => {
  const botao = document.querySelector(".navbar__toggle");
  const menu = document.querySelector(".navbar__menu");

  botao.addEventListener("click", () => {
    botao.classList.toggle("is-open");
    menu.classList.toggle("is-open");
  });
};

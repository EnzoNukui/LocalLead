/* script faq locallead */

export const initFaq = () => {
  const itens = document.querySelectorAll(".faq-item");

  itens.forEach((item) => {
    const pergunta = item.querySelector(".faq-item__question");

    pergunta.addEventListener("click", () => {
      item.classList.toggle("aberto");
    });
  });
};

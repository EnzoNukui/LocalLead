/* script contato locallead */

export const initContato = () => {
  const form = document.querySelector(".contact-form");
  const contactSection = document.querySelector(".contact-container");

  // Validação de segurança para evitar erros de console em outras páginas
  if (!form || !contactSection) return;

  const showError = (input, message) => {
    const group = input.closest(".contact-form__group");
    let error = group.querySelector(".contact-form__error");

    // Se a mensagem de erro ainda não existir, cria o elemento dinamicamente
    if (!error) {
      error = document.createElement("span");
      error.className = "contact-form__error";
      group.appendChild(error);
    }

    error.textContent = message;
    input.classList.add("contact-form__input--error");
  };

  const clearError = (input) => {
    const group = input.closest(".contact-form__group");
    const error = group.querySelector(".contact-form__error");
    if (error) error.remove();
    input.classList.remove("contact-form__input--error");
  };

  const validateEmail = (email) => {
    return email.includes("@") && email.includes(".");
  };

  const showSuccess = () => {
    // Injeta a estrutura de sucesso padronizada com BEM
    contactSection.innerHTML = `
            <div class="success-card">
                <div class="success-card__icon">✅</div>
                <h3 class="success-card__title">Mensagem enviada!</h3>
                <p class="success-card__text">Obrigado por entrar em contato. Nossa equipe vai responder em breve.</p>
                <button type="button" class="success-card__btn">Enviar outra mensagem</button>
            </div>
        `;

    // Captura o botão injetado e adiciona o evento de forma moderna e limpa
    const btnReset = contactSection.querySelector(".success-card__btn");
    btnReset.addEventListener("click", () => {
      window.location.reload();
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const assunto = document.querySelector("#assunto");
    const mensagem = document.querySelector("#mensagem");

    let valid = true;

    if (nome.value.trim() === "") {
      showError(nome, "Por favor, informe seu nome completo.");
      valid = false;
    } else {
      clearError(nome);
    }

    if (!validateEmail(email.value)) {
      showError(email, "Informe um e-mail válido.");
      valid = false;
    } else {
      clearError(email);
    }

    if (assunto.value === "") {
      showError(assunto, "Selecione um assunto.");
      valid = false;
    } else {
      clearError(assunto);
    }

    if (mensagem.value.trim().length < 10) {
      showError(mensagem, "Sua mensagem precisa ter pelo menos 10 caracteres.");
      valid = false;
    } else {
      clearError(mensagem);
    }

    if (valid) showSuccess();
  });
};

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
  menu.classList.toggle("open", !open);
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }),
);

document.getElementById("year").textContent = new Date().getFullYear();

const cards = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxCount = document.querySelector(".lightbox-count");
let active = 0;
let lastFocus = null;

function show(index) {
  active = (index + cards.length) % cards.length;
  const card = cards[active];
  lightboxImage.src = card.querySelector("img").src;
  lightboxImage.alt = card.querySelector("img").alt;
  lightboxCaption.textContent = card.querySelector("strong").textContent;
  lightboxCount.textContent =
    String(active + 1).padStart(2, "0") +
    " / " +
    String(cards.length).padStart(2, "0");
}

function openGallery(index) {
  lastFocus = document.activeElement;
  show(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  document.querySelector(".lightbox-close").focus();
}

function closeGallery() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
  lightboxImage.src = "";
  lastFocus?.focus();
}

cards.forEach((card, index) =>
  card.addEventListener("click", () => openGallery(index)),
);

document
  .querySelector(".lightbox-close")
  .addEventListener("click", closeGallery);
document
  .querySelector(".lightbox-prev")
  .addEventListener("click", () => show(active - 1));
document
  .querySelector(".lightbox-next")
  .addEventListener("click", () => show(active + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeGallery();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") show(active - 1);
  if (event.key === "ArrowRight") show(active + 1);

  if (event.key === "Tab") {
    const buttons = [...lightbox.querySelectorAll("button")];
    const first = buttons[0];
    const last = buttons.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Guia interativo: cria a mensagem com as escolhas da visitante.
const consultSteps = [...document.querySelectorAll(".consult-step")];
const consultProgress = document.querySelector(".consult-progress");
const consultTrack = document.querySelector(".consult-track span");

const consultGoalLabels = {
  loiros: "loiros e coloração",
  mega: "mega hair",
  cuidado: "tratamentos ou corte",
};

const consultResult = {
  loiros: {
    title: "Um novo brilho para chamar de seu.",
    text: "A Larissa pode conversar com você sobre tons e técnicas de coloração que respeitem seus fios e combinem com o visual que você imagina.",
  },
  mega: {
    title: "Mais comprimento, a sua maneira.",
    text: "O próximo passo é conversar sobre volume, comprimento e as possibilidades de mega hair para o resultado que você deseja.",
  },
  cuidado: {
    title: "Seu cabelo merece esse cuidado.",
    text: "Uma conversa sobre a condição dos fios e o visual que você busca ajuda a escolher entre tratamentos e um novo corte.",
  },
};

let selectedGoal = "";

function consultShow(step) {
  consultSteps.forEach((item) => {
    item.hidden = item.dataset.step !== step;
  });

  const completed = step === "result";
  consultProgress.firstElementChild.textContent = completed
    ? "02 / 02"
    : step === "style"
      ? "02 / 02"
      : "01 / 02";
  consultProgress.lastElementChild.textContent = completed
    ? "PRÓXIMO PASSO"
    : step === "style"
      ? "SEU ESTILO"
      : "SEU MOMENTO";
  consultTrack.style.width = step === "goal" ? "50%" : "100%";
}

document.querySelectorAll("[data-goal]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedGoal = button.dataset.goal;
    consultShow("style");
  });
});

document.querySelectorAll("[data-style]").forEach((button) => {
  button.addEventListener("click", () => {
    const style = button.dataset.style;
    const result = consultResult[selectedGoal];
    if (!result) return;

    document.querySelector(".consult-result-title").textContent = result.title;
    document.querySelector(".consult-result-text").textContent = result.text;

    const message =
      `Olá, Larissa! Vi seu site e gostaria de conversar sobre ${consultGoalLabels[selectedGoal]}. ` +
      `Imagino um resultado ${style === "natural" ? "natural e delicado" : "marcante e especial"}. ` +
      `Podemos agendar uma avaliação?`;

    document.querySelector(".consult-whatsapp").href =
      "https://wa.me/5521975463772?text=" + encodeURIComponent(message);

    consultShow("result");
  });
});

document.querySelectorAll(".consult-back").forEach((button) => {
  button.addEventListener("click", () => consultShow("goal"));
});

document.getElementById("year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "×" : "☰";
});
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "☰";
}));

// Reveal elements as they enter the viewport.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Reading progress at the top of the page.
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("progress").style.width = (max > 0 ? window.scrollY / max * 100 : 0) + "%";
}, { passive: true });

// Subtle 3D tilt on desktop package cards.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
  });
}

// Selecting a package pre-fills the consultation form.
document.querySelectorAll(".choose-package").forEach(link => {
  link.addEventListener("click", () => {
    const select = document.getElementById("need");
    const chosen = link.dataset.package;
    [...select.options].forEach(option => {
      if (option.text.includes(chosen.startsWith("Gói Combo") ? "Combo" : "cơ bản")) {
        select.value = option.value;
      }
    });
  });
});

document.getElementById("leadForm").addEventListener("submit", async event => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const area = document.getElementById("area").value.trim();
  const need = document.getElementById("need").value;
  const note = document.getElementById("note").value.trim();

  if (!/^[0-9+ .()-]{9,16}$/.test(phone)) {
    document.getElementById("phone").focus();
    alert("Vui lòng kiểm tra lại số điện thoại.");
    return;
  }

  const message = [
    "Xin chào Phúc, tôi muốn được tư vấn lắp đặt Internet FPT.",
    `Họ và tên: ${name}`,
    `Số điện thoại: ${phone}`,
    `Khu vực lắp đặt: ${area}`,
    `Gói quan tâm: ${need}`,
    `Ghi chú: ${note || "Không có"}`
  ].join("\n");

  const hint = document.getElementById("formHint");
  let copied = false;
  try {
    await navigator.clipboard.writeText(message);
    copied = true;
  } catch (_) {
    const helper = document.createElement("textarea");
    helper.value = message;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try { copied = document.execCommand("copy"); } catch (_) {}
    helper.remove();
  }

  hint.textContent = copied
    ? "Đã sao chép nội dung yêu cầu. Zalo đang được mở — bạn dán tin nhắn và nhấn Gửi cho Phúc nhé."
    : "Zalo đang được mở. Nếu nội dung chưa được sao chép, vui lòng sao chép thông tin từ biểu mẫu và gửi cho Phúc.";
  window.open("https://zalo.me/0372191218", "_blank", "noopener");
});

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


document.getElementById("leadForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const hint = document.getElementById("formHint");

  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("area").value.trim(),
    plan: document.getElementById("need").value,
    note: document.getElementById("note").value.trim()
  };

  if (!data.name || !data.phone || !data.address) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  if (!/^[0-9+ .()-]{9,16}$/.test(data.phone)) {
    alert("Vui lòng kiểm tra lại số điện thoại.");
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Đang gửi yêu cầu...";
  }

  if (hint) hint.textContent = "Đang gửi thông tin...";

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gửi thất bại");
    }

    if (hint) {
      hint.textContent =
        "Đăng ký thành công! Phúc FPT sẽ sớm liên hệ bạn.";
    } else {
      alert("Đăng ký thành công! Phúc FPT sẽ sớm liên hệ bạn.");
    }

    form.reset();

  } catch (error) {
    if (hint) {
      hint.textContent = "Gửi chưa thành công. Vui lòng thử lại.";
    } else {
      alert("Gửi chưa thành công. Vui lòng thử lại.");
    }

  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Gửi yêu cầu qua Zalo";
    }
  }
});

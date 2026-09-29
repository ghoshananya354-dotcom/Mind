
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = new URL(a.href).pathname.replace(/\/+$/, "") || "/";
    if (href === path) a.classList.add("active");
  });

  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({behavior:"smooth"});
    });
  });

  document.querySelectorAll(".checkin").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".checkin").forEach(x => x.classList.remove("selected"));
      item.classList.add("selected");
      localStorage.setItem("mindsprout-checkin", item.dataset.value || "");
    });
  });

  const journal = document.querySelector("#journalText");
  if (journal) {
    journal.value = localStorage.getItem("mindsprout-journal-draft") || "";
    journal.addEventListener("input", () => localStorage.setItem("mindsprout-journal-draft", journal.value));
  }
  const save = document.querySelector("#saveJournal");
  if (save) {
    save.addEventListener("click", () => {
      const value = journal?.value.trim();
      if (!value) return alert("Write something before saving.");
      localStorage.setItem("mindsprout-journal-last", value);
      alert("Entry saved.");
    });
  }

  const form = document.querySelector("#profileForm");
  if (form) {
    const saved = JSON.parse(localStorage.getItem("mindsprout-profile") || "{}");
    Object.entries(saved).forEach(([name,val]) => {
      const el = form.querySelector(`[name="${name}"][value="${CSS.escape(val)}"]`);
      if (el) el.checked = true;
    });
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = {};
      form.querySelectorAll("input:checked").forEach(i => data[i.name] = i.value);
      localStorage.setItem("mindsprout-profile", JSON.stringify(data));
      alert("Preferences saved.");
    });
  }

  const send = document.querySelector("#sendMessage");
  const input = document.querySelector("#chatInput");
  const messages = document.querySelector("#messages");
  if (send && input && messages) {
    const addMessage = (text, user=false) => {
      const el = document.createElement("div");
      el.className = "message" + (user ? " user" : "");
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    };
    send.addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return;
      addMessage(value, true);
      input.value = "";
      setTimeout(() => addMessage("Thanks for sharing. We can keep this simple and go at your comfort level."), 250);
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") send.click();
    });
    document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => {
      input.value = chip.textContent.trim();
      input.focus();
    }));
  }
});

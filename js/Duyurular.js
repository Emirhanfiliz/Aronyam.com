document.addEventListener("DOMContentLoaded", async () => {
  const liste = document.getElementById("duyuru-listesi");
  if (!liste) return;

  async function loadData() {
    const cached = localStorage.getItem("aronyam_duyurular_v1");
    if (cached) {
      try {
        const arr = JSON.parse(cached);
        if (Array.isArray(arr)) return arr;
      } catch {}
    }

    const res = await fetch("/Aronyam.com/duyurular.json");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  const duyurular = await loadData();

  liste.innerHTML = "";

  duyurular
    .sort((a, b) => new Date(b.tarih) - new Date(a.tarih))
    .forEach((d) => {
      const id =
        d.link && String(d.link).includes("#")
          ? String(d.link).split("#")[1]
          : "duyuru-" + d.id;

      const li = document.createElement("li");
      li.className = "duyuru-item";
      li.id = id;

      li.innerHTML = `
        <article class="duyuru-card">
          <span class="duyuru-tarih">${new Date(d.tarih).toLocaleDateString("tr-TR")}</span>
          <h2 class="duyuru-baslik">${d.baslik || ""}</h2>
          <p class="duyuru-ozet">${d.ozet || ""}</p>
        </article>
      `;

      liste.appendChild(li);
    });
});

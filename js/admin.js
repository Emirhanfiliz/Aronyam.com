let duyurularData = [];
let urunlerData = [];

const LS_KEYS = {
  duyuru: "aronyam_duyurular_v1",
  urun: "aronyam_urunler_v1",
};

function saveAll() {
  try {
    localStorage.setItem(LS_KEYS.duyuru, JSON.stringify(duyurularData));
    localStorage.setItem(LS_KEYS.urun, JSON.stringify(urunlerData));
  } catch {}
}

function loadFromStorageOrFetch(key, url) {
  const cached = localStorage.getItem(key);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return Promise.resolve(parsed);
    } catch {}
  }

  return fetch(url)
    .then((r) => r.json())
    .then((d) => (Array.isArray(d) ? d : []))
    .catch(() => []);
}

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const tabs = document.querySelectorAll(".tab-content");
  if (!buttons.length || !tabs.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));

      btn.classList.add("active");

      const hedef = btn.getAttribute("data-tab");
      const aktifTab = document.getElementById("tab-" + hedef);
      if (aktifTab) aktifTab.classList.add("active");
    });
  });
}

function getNextId(list) {
  if (!list || list.length === 0) return 1;
  let max = 0;
  list.forEach((x) => {
    const n = Number(x.id);
    if (!Number.isNaN(n) && n > max) max = n;
  });
  return max + 1;
}

function renderDuyurular() {
  const tbody = document.querySelector("#duyuru-table tbody");
  const jsonArea = document.getElementById("duyuru-json");
  if (!tbody || !jsonArea) return;

  tbody.innerHTML = "";

  const sorted = [...duyurularData].sort(
    (a, b) => new Date(b.tarih) - new Date(a.tarih)
  );

  sorted.forEach((d) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.tarih ? new Date(d.tarih).toLocaleDateString("tr-TR") : ""}</td>
      <td>${d.baslik || ""}</td>
      <td><button class="delete-btn" data-type="duyuru" data-id="${d.id}">Sil</button></td>
    `;
    tbody.appendChild(tr);
  });

  jsonArea.value = JSON.stringify(duyurularData, null, 2);
}

function renderUrunler() {
  const tbody = document.querySelector("#urun-table tbody");
  const jsonArea = document.getElementById("urun-json");
  if (!tbody || !jsonArea) return;

  tbody.innerHTML = "";

  urunlerData.forEach((u) => {
    const ad = u.adı || u.ad || "";
    const fiyat = u.fiyatı != null ? u.fiyatı : "";
    const stok = u.stok != null ? u.stok : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${ad}</td>
      <td>${fiyat}</td>
      <td>${stok}</td>
      <td><button class="delete-btn" data-type="urun" data-id="${u.id}">Sil</button></td>
    `;
    tbody.appendChild(tr);
  });

  jsonArea.value = JSON.stringify(urunlerData, null, 2);
}

function loadDuyurular() {
  loadFromStorageOrFetch(LS_KEYS.duyuru, "/Aronyam.com/duyurular.json").then(
    (data) => {
      duyurularData = data;
      saveAll();
      renderDuyurular();
    }
  );
}

function loadUrunler() {
  loadFromStorageOrFetch(LS_KEYS.urun, "/Aronyam.com/products.json").then(
    (data) => {
      urunlerData = data;
      saveAll();
      renderUrunler();
    }
  );
}

function initDuyuruForm() {
  const form = document.getElementById("duyuru-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const baslikInput = document.getElementById("duyuru-baslik");
    const tarihInput = document.getElementById("duyuru-tarih");
    const ozetInput = document.getElementById("duyuru-ozet");
    const resimInput = document.getElementById("duyuru-resim");
    const linkInput = document.getElementById("duyuru-link");

    const baslik = baslikInput ? baslikInput.value.trim() : "";
    const tarih = tarihInput ? tarihInput.value : "";
    const ozet = ozetInput ? ozetInput.value.trim() : "";
    const resim = resimInput ? resimInput.value.trim() : "";
    const link = linkInput ? linkInput.value.trim() : "";

    if (!baslik || !tarih || !ozet) return;

    duyurularData.push({
      id: getNextId(duyurularData),
      baslik,
      ozet,
      tarih,
      resim,
      link,
    });

    saveAll();
    renderDuyurular();
    form.reset();
  });
}

function initUrunForm() {
  const form = document.getElementById("urun-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const adInput = document.getElementById("urun-ad");
    const kategoriInput = document.getElementById("urun-kategori");
    const fiyatInput = document.getElementById("urun-fiyat");
    const stokInput = document.getElementById("urun-stok");
    const puanInput = document.getElementById("urun-puan");
    const miktarInput = document.getElementById("urun-miktar");
    const aciklamaInput = document.getElementById("urun-aciklama");
    const resimInput = document.getElementById("urun-resim");
    const etiketlerInput = document.getElementById("urun-etiketler");

    const ad = adInput ? adInput.value.trim() : "";
    const kategori = kategoriInput ? kategoriInput.value.trim() : "";
    const fiyat = fiyatInput ? Number(fiyatInput.value) : NaN;
    const stok = stokInput ? Number(stokInput.value) : NaN;
    const puan = puanInput && puanInput.value !== "" ? Number(puanInput.value) : 0;
    const miktar = miktarInput ? miktarInput.value.trim() : "";
    const aciklama = aciklamaInput ? aciklamaInput.value.trim() : "";
    const resim = resimInput ? resimInput.value.trim() : "";

    const etiketlerText = etiketlerInput ? etiketlerInput.value.trim() : "";
    const etiketler = etiketlerText
      ? etiketlerText.split(",").map((x) => x.trim()).filter(Boolean)
      : [];

    if (!ad || !kategori || !aciklama || !resim) return;
    if (Number.isNaN(fiyat) || Number.isNaN(stok)) return;

    urunlerData.push({
      id: getNextId(urunlerData),
      adı: ad,
      kategori,
      fiyatı: fiyat,
      açıklama: aciklama,
      resim,
      stok,
      etiketler,
      puan: Number.isNaN(puan) ? 0 : puan,
      miktar,
    });

    saveAll();
    renderUrunler();
    form.reset();
    const puanField = document.getElementById("urun-puan");
    if (puanField) puanField.value = "0";
  });
}

function initDeleteHandlers() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!target || !target.classList || !target.classList.contains("delete-btn"))
      return;

    const type = target.getAttribute("data-type");
    const id = Number(target.getAttribute("data-id"));
    if (Number.isNaN(id)) return;

    if (type === "duyuru") {
      duyurularData = duyurularData.filter((x) => Number(x.id) !== id);
      saveAll();
      renderDuyurular();
      return;
    }

    if (type === "urun") {
      urunlerData = urunlerData.filter((x) => Number(x.id) !== id);
      saveAll();
      renderUrunler();
      return;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initDuyuruForm();
  initUrunForm();
  initDeleteHandlers();
  loadDuyurular();
  loadUrunler();
});

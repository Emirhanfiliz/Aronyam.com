let duyurularData = [];
let urunlerData = [];

function initTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const tabs = document.querySelectorAll(".tab-content");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            tabs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            const target = btn.getAttribute("data-tab");
            const tabEl = document.getElementById("tab-" + target);
            if (tabEl) tabEl.classList.add("active");
        });
    });
}

function loadDuyurular() {
    fetch("/Aronyam.com/duyurular.json")
        .then(r => r.json())
        .then(data => {
            duyurularData = Array.isArray(data) ? data : [];
            renderDuyurular();
        })
        .catch(() => {
            duyurularData = [];
            renderDuyurular();
        });
}

function loadUrunler() {
    fetch("/Aronyam.com/products.json")
        .then(r => r.json())
        .then(data => {
            urunlerData = Array.isArray(data) ? data : [];
            renderUrunler();
        })
        .catch(() => {
            urunlerData = [];
            renderUrunler();
        });
}

function renderDuyurular() {
    const tbody = document.querySelector("#duyuru-table tbody");
    const jsonArea = document.getElementById("duyuru-json");
    if (!tbody || !jsonArea) return;

    tbody.innerHTML = "";

    duyurularData.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.tarih ? new Date(item.tarih).toLocaleDateString("tr-TR") : ""}</td>
            <td>${item.baslik || ""}</td>
            <td><button class="delete-btn" data-type="duyuru" data-id="${item.id}">Sil</button></td>
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

    urunlerData.forEach(item => {
        const ad = item.adı || item.ad || item.name || "";
        const fiyat = item.fiyatı != null ? item.fiyatı : (item.fiyat != null ? item.fiyat : (item.price != null ? item.price : ""));
        const stok = item.stok != null ? item.stok : "";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${ad}</td>
            <td>${fiyat}</td>
            <td>${stok}</td>
            <td><button class="delete-btn" data-type="urun" data-id="${item.id}">Sil</button></td>
        `;
        tbody.appendChild(tr);
    });

    jsonArea.value = JSON.stringify(urunlerData, null, 2);
}

function getNextId(list) {
    if (!list.length) return 1;
    const ids = list.map(x => parseInt(x.id, 10) || 0);
    const maxId = Math.max(...ids);
    return maxId + 1;
}

function initDuyuruForm() {
    const form = document.getElementById("duyuru-form");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const baslikInput = document.getElementById("duyuru-baslik");
        const tarihInput = document.getElementById("duyuru-tarih");
        const ozetInput = document.getElementById("duyuru-ozet");
        const resimInput = document.getElementById("duyuru-resim");
        const linkInput = document.getElementById("duyuru-link");

        const baslik = baslikInput.value.trim();
        const tarih = tarihInput.value;
        const ozet = ozetInput.value.trim();
        const resim = resimInput.value.trim();
        const link = linkInput.value.trim();

        if (!baslik || !tarih || !ozet) return;

        const newItem = {
            id: getNextId(duyurularData),
            baslik: baslik,
            ozet: ozet,
            tarih: tarih,
            resim: resim,
            link: link
        };

        duyurularData.push(newItem);
        renderDuyurular();

        baslikInput.value = "";
        tarihInput.value = "";
        ozetInput.value = "";
        resimInput.value = "";
        linkInput.value = "";
    });
}

function initUrunForm() {
    const form = document.getElementById("urun-form");
    if (!form) return;

    form.addEventListener("submit", e => {
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

        const ad = adInput.value.trim();
        const kategori = kategoriInput.value.trim();
        const fiyat = Number(fiyatInput.value);
        const stok = Number(stokInput.value);
        const puan = puanInput.value ? Number(puanInput.value) : 0;
        const miktar = miktarInput.value.trim();
        const aciklama = aciklamaInput.value.trim();
        const resim = resimInput.value.trim();
        const etiketlerText = etiketlerInput.value.trim();

        if (!ad || !kategori || !aciklama || !resim || isNaN(fiyat) || isNaN(stok)) return;

        const etiketler = etiketlerText
            ? etiketlerText.split(",").map(x => x.trim()).filter(x => x.length > 0)
            : [];

        const yeniUrun = {
            id: getNextId(urunlerData),
            adı: ad,
            kategori: kategori,
            fiyatı: fiyat,
            açıklama: aciklama,
            resim: resim,
            stok: stok,
            etiketler: etiketler,
            puan: puan,
            miktar: miktar
        };

        urunlerData.push(yeniUrun);
        renderUrunler();

        form.reset();
        puanInput.value = "0";
    });
}

function initDeleteHandlers() {
    document.addEventListener("click", e => {
        const btn = e.target;
        if (!btn.classList.contains("delete-btn")) return;

        const type = btn.getAttribute("data-type");
        const id = parseInt(btn.getAttribute("data-id"), 10);
        if (isNaN(id)) return;

        if (type === "duyuru") {
            duyurularData = duyurularData.filter(x => parseInt(x.id, 10) !== id);
            renderDuyurular();
        } else if (type === "urun") {
            urunlerData = urunlerData.filter(x => parseInt(x.id, 10) !== id);
            renderUrunler();
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

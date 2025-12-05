let duyurularData = [];
let urunlerData = [];

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
            if (aktifTab) {
                aktifTab.classList.add("active");
            }
        });
    });
}

function loadDuyurular() {
    fetch("/Aronyam.com/duyurular.json")
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) {
                duyurularData = data;
            } else {
                duyurularData = [];
            }
            renderDuyurular();
        })
        .catch(() => {
            duyurularData = [];
            renderDuyurular();
        });
}

function loadUrunler() {
    fetch("/Aronyam.com/products.json")
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) {
                urunlerData = data;
            } else {
                urunlerData = [];
            }
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

    duyurularData.forEach((duyuru) => {
        const tr = document.createElement("tr");

        const tarihMetin = duyuru.tarih
            ? new Date(duyuru.tarih).toLocaleDateString("tr-TR")
            : "";

        tr.innerHTML = `
            <td>${duyuru.id}</td>
            <td>${tarihMetin}</td>
            <td>${duyuru.baslik || ""}</td>
            <td>
                <button class="delete-btn" data-type="duyuru" data-id="${duyuru.id}">
                    Sil
                </button>
            </td>
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

    urunlerData.forEach((urun) => {
        const tr = document.createElement("tr");

        const ad = urun.adı || urun.ad || "";
        const fiyat = urun.fiyatı != null ? urun.fiyatı : "";
        const stok = urun.stok != null ? urun.stok : "";

        tr.innerHTML = `
            <td>${urun.id}</td>
            <td>${ad}</td>
            <td>${fiyat}</td>
            <td>${stok}</td>
            <td>
                <button class="delete-btn" data-type="urun" data-id="${urun.id}">
                    Sil
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    jsonArea.value = JSON.stringify(urunlerData, null, 2);
}

function getNextId(list) {
    if (!list || list.length === 0) return 1;

    let max = 0;
    list.forEach((item) => {
        const num = parseInt(item.id, 10);
        if (!isNaN(num) && num > max) {
            max = num;
        }
    });

    return max + 1;
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

        const baslik = baslikInput.value.trim();
        const tarih = tarihInput.value;
        const ozet = ozetInput.value.trim();
        const resim = resimInput.value.trim();
        const link = linkInput.value.trim();

        if (!baslik || !tarih || !ozet) {
            return;
        }

        const yeniDuyuru = {
            id: getNextId(duyurularData),
            baslik: baslik,
            ozet: ozet,
            tarih: tarih,
            resim: resim,
            link: link
        };

        duyurularData.push(yeniDuyuru);
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

        const ad = adInput.value.trim();
        const kategori = kategoriInput.value.trim();
        const fiyatDeger = fiyatInput.value;
        const stokDeger = stokInput.value;
        const puanDeger = puanInput.value;
        const miktar = miktarInput.value.trim();
        const aciklama = aciklamaInput.value.trim();
        const resim = resimInput.value.trim();
        const etiketlerText = etiketlerInput.value.trim();

        const fiyat = Number(fiyatDeger);
        const stok = Number(stokDeger);
        const puan = puanDeger ? Number(puanDeger) : 0;

        if (!ad || !kategori || !aciklama || !resim) return;
        if (isNaN(fiyat) || isNaN(stok)) return;

        let etiketler = [];
        if (etiketlerText) {
            etiketler = etiketlerText
                .split(",")
                .map((x) => x.trim())
                .filter((x) => x.length > 0);
        }

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
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.classList || !target.classList.contains("delete-btn")) return;

        const type = target.getAttribute("data-type");
        const idText = target.getAttribute("data-id");
        const id = parseInt(idText, 10);

        if (isNaN(id)) return;

        if (type === "duyuru") {
            duyurularData = duyurularData.filter((item) => {
                return parseInt(item.id, 10) !== id;
            });
            renderDuyurular();
        } else if (type === "urun") {
            urunlerData = urunlerData.filter((item) => {
                return parseInt(item.id, 10) !== id;
            });
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

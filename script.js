new Swiper('.card-wrapper', {
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const detayButonlari = document.querySelectorAll('.detay-goster-btn');
    const kapatButonlari = document.querySelectorAll('.kapat-btn');

    detayButonlari.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = "block";
            }
        });
    });

    kapatButonlari.forEach(span => {
        span.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = "none";
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    });
});

const counters = document.querySelectorAll(".numbers__container span");
const numbers__container = document.querySelector(".numbers__container");
let activated = false;

window.addEventListener("scroll", () => {
    if (
        window.pageYOffset >
        numbers__container.offsetTop - numbers__container.offsetHeight - 200 &&
        activated === false
    ) {
        counters.forEach((counter) => {
            counter.innerText = 0;
            let count = 0;

            function updateCount() {
                const target = parseInt(counter.dataset.count, 10);

                if (count < target) {
                    count++;
                    counter.innerText = count;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            }
            updateCount();
        });
        activated = true;
    } else if (
        ((window.pageYOffset <
            numbers__container.offsetTop - numbers__container.offsetHeight - 500) ||
            window.pageYOffset === 0) &&
        activated === true
    ) {
        counters.forEach((counter) => {
            counter.innerText = 0;
        });
        activated = false;
    }
});

fetch('/Aronyam.com/duyurular.json')
    .then(response => response.json())
    .then(duyurular => {
        const container = document.getElementById('duyurular-container');
        if (!container) return;

        duyurular.forEach(duyuru => {
            const cardHTML = `
                <li class="card-item swiper-slide">
                    <a 
                        href="${duyuru.link}" 
                        class="card-link"
                        data-baslik="${duyuru.baslik}"
                        data-ozet="${duyuru.ozet}"
                        data-tarih="${duyuru.tarih}"
                    >
                        <span class="badge">${new Date(duyuru.tarih).toLocaleDateString('tr-TR')}</span>
                        <div class="card-content">
                            <h3 class="duyurr card-title">${duyuru.baslik}</h3>
                            <p class="duyurr card-text">${duyuru.ozet}</p>
                            <p class="duyurr card-action">Detaylı Oku &rarr;</p>
                        </div>
                    </a>
                </li>
            `;
            container.innerHTML += cardHTML;
        });

        new Swiper('#duyurular-swiper', {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });

        const modal = document.getElementById('duyuru-detay-modal');
        const modalBaslik = document.getElementById('modal-baslik');
        const modalTarih = document.getElementById('modal-tarih');
        const modalOzet = document.getElementById('modal-ozet');

        container.addEventListener('click', function(e) {
            const cardLink = e.target.closest('.card-link');
            if (!cardLink) return;

            e.preventDefault();

            const baslik = cardLink.dataset.baslik;
            const ozet = cardLink.dataset.ozet;
            const tarih = cardLink.dataset.tarih;

            modalBaslik.textContent = baslik;
            modalTarih.textContent = new Date(tarih).toLocaleDateString('tr-TR');
            modalOzet.textContent = ozet;

            modal.style.display = 'block';
        });
    })
    .catch(error => console.error('Duyuru verileri yüklenirken hata:', error));

fetch("/html/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const iletisimBtn = document.getElementById("iletişim");
        if (iletisimBtn) {
            iletisimBtn.addEventListener("click", function () {
                window.location.href = "/html/iletişim.html";
            });
        }

        const urunlerBtn = document.getElementById("ürünler");
        if (urunlerBtn) {
            urunlerBtn.addEventListener("click", function () {
                window.location.href = "/html/ürünler.html";
            });
        }
    })
    .catch(error => console.error('Header yüklenirken hata:', error));

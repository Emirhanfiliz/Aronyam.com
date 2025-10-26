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
        },
    }
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
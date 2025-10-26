fetch("../html/header.html") 
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const menuToggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('header ul');
        const urunlerListe = document.querySelector('.urunler-liste');
        const iletisimBtn = document.getElementById("iletişim");

        if (iletisimBtn) {
            iletisimBtn.addEventListener("click", function () {
                window.location.href = "../html/iletişim.html";
            });
        }

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        if (window.innerWidth <= 768 && urunlerListe) {
            urunlerListe.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.parentElement === urunlerListe) {
                    e.preventDefault();
                    urunlerListe.classList.toggle('active');
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('header') && menu) {
                menu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        });
    })
    .catch(error => console.error('Header yüklenirken hata:', error));

fetch("../html/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(error => console.error('Footer yüklenirken hata:', error));
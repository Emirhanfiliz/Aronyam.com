document.addEventListener('DOMContentLoaded', function () {
    fetch('/Aronyam.com/duyurular.json')
        .then(response => response.json())
        .then(duyurular => {
            const liste = document.getElementById('duyuru-listesi');
            if (!liste) return;

            duyurular.forEach(duyuru => {
                const anchorId = duyuru.link && duyuru.link.includes('#')
                    ? duyuru.link.split('#')[1]
                    : 'duyuru-' + duyuru.id;

                const li = document.createElement('li');
                li.className = 'duyuru-item';
                li.id = anchorId;

                li.innerHTML = `
                    <article class="duyuru-card">
                        <span class="duyuru-tarih">
                            ${new Date(duyuru.tarih).toLocaleDateString('tr-TR')}
                        </span>
                        <h2 class="duyuru-baslik">${duyuru.baslik}</h2>
                        <p class="duyuru-ozet">${duyuru.ozet}</p>
                    </article>
                `;

                liste.appendChild(li);
            });
        })
        .catch(error => console.error('Duyurular yüklenirken hata:', error));
});


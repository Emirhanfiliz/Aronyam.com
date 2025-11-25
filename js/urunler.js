fetch('../products.json')
  .then(response => response.json())
  .then(data => {
    const urunlerListesi = document.getElementById('urunlerListesi');

   
    const hash = window.location.hash.replace('#', ''); 
    let gosterilecekUrunler = data;

    if (hash) {
      gosterilecekUrunler = data.filter(urun =>
        Array.isArray(urun.etiketler) && urun.etiketler.includes(hash)
      );
    }

    urunlerListesi.innerHTML = '';

    if (gosterilecekUrunler.length === 0) {
      urunlerListesi.innerHTML = `<p style="color:white;">Bu kategoriye ait ürün bulunamadı.</p>`;
      return;
    }

   
    gosterilecekUrunler.forEach(urun => {
      const kart = document.createElement('a');
      kart.classList.add('urun-kart');
      kart.href = `/Aronyam.com/html/detay_sayfasi.html?id=${urun.id}`;

      kart.innerHTML = `
        <img src="${urun.resim}" alt="${urun.adı}" class="urun-resim">
        <div class="urunler-txt">  
          <p>${urun.adı}</p>
          <p>Kategori: ${urun.kategori}</p>
          <p>Puan: ${urun.puan}</p>
        </div>
      `;

      urunlerListesi.appendChild(kart);
    });
  })
  .catch(error => console.error('Veri yüklenemedi:', error));

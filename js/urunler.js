fetch('../products.json')
  .then(response => response.json())
  .then(data => {
    const urunlerListesi = document.getElementById('urunlerListesi');

    data.forEach(urun => {
      const kart = document.createElement('div');
      kart.classList.add('urun-kart');
      kart.innerHTML = `
      <img src="${urun.resim}" alt="${urun.adı}"class="urun-resim" >
        <p>${urun.adı}</p>
        <p>Kategori: ${urun.kategori}</p>
        <p>puan${urun.puan}</p>
        
      `;
      urunlerListesi.appendChild(kart);
    });
  })
  .catch(error => console.error('Veri yüklenemedi:', error));

// URL’den ürün ID’sini al
const urlParams = new URLSearchParams(window.location.search);
const urunId = urlParams.get('id');

if (urunId !== null) {
    fetch('/Aronyam.com/products.json') 
        .then(response => response.json())
        .then(data => {
           
            const secilenUrun = data.find(urun => urun.id == Number(urunId));

            if (secilenUrun) {
               
                document.getElementById('urunAdi').textContent = secilenUrun["adı"];
                document.getElementById('urunResmi').src = secilenUrun["resim"];
                document.getElementById('urunKategorisi').textContent = `Kategori: ${secilenUrun["kategori"]}`;
                document.getElementById('urunFiyati').textContent = `Fiyat: ${secilenUrun["fiyatı"]}₺`;
                document.getElementById('urunAciklama').textContent = secilenUrun["açıklama"];
                document.getElementById('urunMiktar').textContent=secilenUrun["miktar"];
                
            } else {
                console.error('Ürün bulunamadı.');
            }
        })
        .catch(error => console.error('Veri yüklenemedi:', error));
} else {
    console.error('URL’de ürün ID’si eksik.');
}

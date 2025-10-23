  fetch("../html/header.html")
            .then(res => res.text())
            .then(data => {
                document.getElementById("header").innerHTML = data;


                document.getElementById("iletişim").addEventListener("click", function () {
                    window.location.href = "../html/iletişim.html";
                });
            });
            
            fetch("../html/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
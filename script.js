new Swiper('.card-wrapper', {
 spaceBetween:30,

  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints:{
    0:{
        slidesPerView:1
    },
    768:{
        slidesPerView:2
    },
    1024:{
        slidesPerView:3
    },
  }
  
});

document.getElementById("iletişim").addEventListener("click",function()
{
    window.location.href="./html/iletişim.html";
});
document.getElementById("ürünler").addEventListener("click",function()
{
    window.location.href="html/ürünler.html";
}

);
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

fetch("../header.html")
   .then(res => res.text())
   .then(data => document.getElementById("header").innerHTML = data);

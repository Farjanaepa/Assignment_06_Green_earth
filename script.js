const cartBox = document.querySelector(".cart-items-container");
let cart = {};
let total = 0;

// load categories
fetch("https://openapi.programming-hero.com/api/categories")
  .then(response => response.json())
  .then(data => {
    const ul = document.querySelector(".tree-categories");
    data.categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat.category_name;
      li.className = "cursor-pointer px-3 py-2 hover:bg-green-500 hover:text-white rounded-lg";
      li.onclick = () => {
        document.querySelector(".tree-card-container").innerHTML = "";
        loadCat(cat.id);
      };
      ul.appendChild(li);
    });
  })
  .catch(err => console.error(err));

// load all plants
function loadAll() {
  document.getElementById("spinner").classList.remove("hidden");
  document.querySelector(".tree-card-section").classList.add("hidden");
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(response => response.json())
    .then(data => {
      showTrees(data.plants);
    })
    .catch(err => console.error(err));
}
loadAll();

document.querySelector(".all-trees").addEventListener("click", loadAll);

function showTrees(list) {
  const box = document.querySelector(".tree-card-container");
  box.innerHTML = "";
  list.forEach(tree => {
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-sm";
    card.innerHTML = `
      <div class="p-3">
        <figure>
        <div class=" object-contain md:h-[15rem] w-full mx-auto">
        <img src="${tree.image}" class = "rounded-lg  w-full h-fix">
        </div>
        </figure>
      </div>
      <div class="card-body">
        <h2 class="card-title inter cursor-pointer">${tree.name}</h2>
        <p>${tree.description.slice(0, 80)}${tree.description.length > 80 ? "..." : ""}</p>
        <div class="flex justify-between items-center">
          <div class="badge badge-outline rounded-3xl bg-[#DCFCE7] text-[#15803D]">${tree.category}</div>
          <div class="inter font-semibold">$${parseInt(tree.price)}</div>
        </div>
        <button class="btn w-full rounded-3xl text-white bg-[#15803D] hover:bg-[#4ade80]">Add to Cart</button>
      </div>
    `;

    card.querySelector("h2").onclick = () => {
      const modal = document.getElementById("treeModal");
      modal.querySelector(".modal-title").innerText = tree.name;
      modal.querySelector(".modal-desc").innerText = tree.description;
      modal.querySelector(".modal-img").src = tree.image;
      modal.querySelector(".modal-category").innerText = "Category: " + tree.category;
      modal.querySelector(".modal-price").innerText = "Price: $" + tree.price;
      modal.showModal();
    };

    card.querySelector("button").onclick = () => {
      if (!cart[tree.id]) {
        const div = document.createElement("div");
        div.className = "card bg-[#F0FDF4] shadow-sm flex flex-row justify-between items-center gap-4 p-2";
        div.innerHTML = `
          <div>
            <p class="inter font-semibold">${tree.name}</p>
            <p class="inter font-semibold item-count">$${parseInt(tree.price)} x 1</p>
          </div>
          <button class="text-red-500 font-bold">X</button>
        `;
        div.querySelector("button").onclick = () => {
          delete cart[tree.id];
          div.remove();
          recalc();
        };
        cartBox.appendChild(div);
        cart[tree.id] = { qty: 1, price: parseInt(tree.price), el: div };
         alert(`"${tree.name}" added to your cart!`);
      } else {
        cart[tree.id].qty++;
        cart[tree.id].el.querySelector(".item-count").innerText =
          "$" + cart[tree.id].price + " x " + cart[tree.id].qty;
      }
      recalc();
    };

    box.appendChild(card);
  });
  document.getElementById("spinner").classList.add("hidden");
  document.querySelector(".tree-card-section").classList.remove("hidden");
}

function recalc() {
  total = 0;
  Object.values(cart).forEach(cart => {
    total += cart.price * cart.qty;
  });
  document.querySelector(".total-amount").innerText = "$" + total;
}

function loadCat(id) {
  document.getElementById("spinner").classList.remove("hidden");
  document.querySelector(".tree-card-section").classList.add("hidden");
  fetch("https://openapi.programming-hero.com/api/category/" + id)
    .then(response => response.json())
    .then(det => showTrees(det.plants))
    .catch(err => console.error(err));
}

// donate
document.querySelector(".donateBtn").onclick = e => {
  e.preventDefault();
  const name = document.querySelector(".inputName").value.trim();
  const email = document.querySelector(".inputEmail").value.trim();
  const num = document.querySelector(".selectTreeNum").value;
  if (!name || !email || !num) return alert("Fill all fields!");
  alert(`Thanks ${name}! Donated ${num} trees. Email: ${email}`);
};

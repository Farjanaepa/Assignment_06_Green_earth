// ------------------ GLOBAL VARIABLES ------------------
const cartItemContainer = document.querySelector(".cart-items-container");
let totalAmount = 0;
let cartItems = {};

// ------------------ SPINNER ------------------
const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.querySelector(".tree-card-section").classList.add("hidden");
  } else {
    document.querySelector(".tree-card-section").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// ------------------ CATEGORY LOAD ------------------
const loadCategories = async () => {
  const url = `https://openapi.programming-hero.com/api/categories`;
  const res = await fetch(url);
  const data = await res.json();
  displayCategories(data.categories);
};

const displayCategories = (categories) => {
  const categoriesContainer = document.querySelector(".treeCatagories");
  categories.forEach((category) => {
    const categoryList = document.createElement("li");
     categoryList.classList.add(
      "cursor-pointer",
      "px-3",
      "py-2",
      "rounded-lg",
      "hover:bg-green-500",
      "hover:text-white",
      "transition"
    );
    const categoryListLink = document.createElement("a");
    categoryListLink.innerText = category.category_name;

    categoryList.addEventListener("click", (e) => {
      e.stopPropagation();
      const treesContainer = document.querySelector(".tree-card-container");
      treesContainer.innerHTML = "";
      loadTreeData(category.id);
    });

    categoryList.appendChild(categoryListLink);
    categoriesContainer.appendChild(categoryList);
  });
};
loadCategories();

// ------------------ LOAD TREES ------------------
const loadAllTreesData = async () => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/plants`;
  const res = await fetch(url);
  const data = await res.json();
  displayAllTreesData(data.plants);
};
loadAllTreesData();

document.querySelector(".all-trees").addEventListener("click", (e) => {
  e.stopPropagation();
  loadAllTreesData();
});

// ------------------ CREATE CARD ------------------
const creatingCard = (tree) => {
  const treesContainer = document.querySelector(".tree-card-container");

  const card = document.createElement("div");
  card.classList.add("card", "bg-base-100", "shadow-sm");

  // Image
  const imageDiv = document.createElement("div");
  imageDiv.classList.add("p-3");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = tree.image;
  img.classList.add("rounded-lg", "object-contain", "md:h-[18rem]", "mx-auto");
  figure.appendChild(img);
  imageDiv.appendChild(figure);

  // Card Body
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Title with modal trigger
  const title = document.createElement("h2");
  title.classList.add("card-title", "inter", "cursor-pointer");
  title.innerText = tree.name;
  title.addEventListener("click", () => openModal(tree));
  cardBody.appendChild(title);

  // Description
  const description = document.createElement("p");
  description.innerText = tree.description;
  cardBody.appendChild(description);

  // Category + Price
  const flexContainer = document.createElement("div");
  flexContainer.classList.add("flex", "justify-between", "items-center");

  const badge = document.createElement("div");
  badge.classList.add(
    "badge", "badge-outline", "rounded-3xl",
    "bg-[#DCFCE7]", "text-[#15803D]", "inter"
  );
  badge.innerText = tree.category;

  const price = document.createElement("div");
  price.classList.add("inter", "font-semibold");
  price.innerText = `$${parseInt(tree.price)}`;

  flexContainer.appendChild(badge);
  flexContainer.appendChild(price);
  cardBody.appendChild(flexContainer);

  // Add to Cart
  const button = document.createElement("button");
  button.classList.add(
    "btn", "w-full", "rounded-3xl",
    "text-white", "bg-[#15803D]", "hover:bg-[#4ade80]"
  );
  button.innerText = "Add to Cart";
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(tree);
  });
  cardBody.appendChild(button);

  // Append
  card.appendChild(imageDiv);
  card.appendChild(cardBody);
  treesContainer.appendChild(card);
};

// ------------------ CART FUNCTIONALITY ------------------
const addToCart = (tree) => {
  if (!cartItems[tree.id]) {
    cartItems[tree.id] = { count: 0, tree: null };
  }
  cartItems[tree.id].count++;

  if (cartItems[tree.id].tree) {
    cartItems[tree.id].tree.remove();
  }

  cartItems[tree.id].tree = createAddCart(tree, tree.id, cartItems[tree.id].count);
};

const createAddCart = (tree, id, count) => {
  const itemParent = document.createElement("div");
  itemParent.classList.add(
    "card", "bg-[#F0FDF4]", "shadow-sm",
    "flex", "flex-row", "justify-between",
    "items-center", "gap-4", "p-2"
  );

  const itemDes = document.createElement("div");
  const itemName = document.createElement("p");
  itemName.classList.add("inter", "font-semibold");
  itemName.innerText = tree.name;

  const itemCount = document.createElement("p");
  itemCount.classList.add("inter", "font-semibold");
  itemCount.innerText = `$${parseInt(tree.price)} x ${count}`;

  itemDes.appendChild(itemName);
  itemDes.appendChild(itemCount);

  const deleteIcon = document.createElement("button");
  deleteIcon.classList.add("text-red-500", "font-bold");
  deleteIcon.innerText = "X";
  deleteIcon.addEventListener("click", () => {
    if (cartItems[id]) {
      totalAmount -= parseInt(tree.price) * cartItems[id].count;
      delete cartItems[id];
      itemParent.remove();
      updateTotalAmount();
    }
  });

  itemParent.appendChild(itemDes);
  itemParent.appendChild(deleteIcon);
  cartItemContainer.appendChild(itemParent);

  totalAmount += parseInt(tree.price);
  updateTotalAmount();

  return itemParent;
};

const updateTotalAmount = () => {
  const totalElement = document.querySelector(".total-amount");
  totalElement.innerText = `$${totalAmount}`;
};

// ------------------ TREE DISPLAY ------------------
const displayAllTreesData = (trees) => {
  const treesContainer = document.querySelector(".tree-card-container");
  treesContainer.innerHTML = "";
  trees.forEach((tree) => creatingCard(tree));
  manageSpinner(false);
};

const loadTreeData = async (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayTreeData(data.plants);
};

const displayTreeData = (trees) => {
  const treesContainer = document.querySelector(".tree-card-container");
  treesContainer.innerHTML = "";
  trees.forEach((tree) => creatingCard(tree));
  manageSpinner(false);
};

// ------------------ MODAL ------------------
const openModal = (tree) => {
  const modal = document.getElementById("treeModal");
  modal.querySelector(".modal-title").innerText = tree.name;
  modal.querySelector(".modal-desc").innerText = tree.description;
  modal.querySelector(".modal-img").src = tree.image;
  modal.querySelector(".modal-category").innerText = `Category: ${tree.category}`;
  modal.querySelector(".modal-price").innerText = `Price: $${tree.price}`;
  modal.showModal();
};

// ------------------ DONATE ------------------
document.querySelector(".donateBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.querySelector(".inputName").value;
  const email = document.querySelector(".inputEmail").value;
  const num = document.querySelector(".selectTreeNum").value;

  if (name && email && num) {
    alert(`Thank You For Your Contribution ${name}
Your Email: ${email}
Number of Trees: ${num}`);
  }
});

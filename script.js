import { menuData } from "./data.js";

const themeSwitch = document.querySelector(".theme_switch");
const themeBtn = document.querySelectorAll(".theme_btn");
const sunBtn = document.querySelector("#sun_btn");
const moonBtn = document.querySelector("#moon_btn");

const menuGrid = document.querySelector(".menu_grid");
const tabsContainer = document.querySelector(".tabs_container");
const tabItem = document.querySelectorAll(".tab_item");
const uploadBtn = document.querySelector("#upload_btn");

let selectedCategory = "Coffee";

//Check saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark_theme");
  sunBtn.disabled = false;
  moonBtn.disabled = true;
} else {
  document.documentElement.classList.remove("dark_theme");
  sunBtn.disabled = true;
  moonBtn.disabled = false;
}

// Toggle theme
themeSwitch.addEventListener("click", function (e) {

  const themeBtn = e.target.closest(".theme_btn");
  if (!themeBtn) return;
  
  if (document.documentElement.classList.toggle("dark_theme")) {
    sunBtn.disabled = false;
    moonBtn.disabled = true;
    localStorage.setItem("theme", "dark");
  } else {
    sunBtn.disabled = true;
    moonBtn.disabled = false;
    localStorage.setItem("theme", "light");
  }
});

// Menu-page: Toggle Tabs
if (tabsContainer) {
  tabsContainer.addEventListener("click", function (e) {

    const button = e.target.closest(".tab_item");
    if (!button) return;

    tabItem.forEach((item) => {
      item.classList.remove("active");
      item.disabled = false;
    });

    selectedCategory = button.dataset.category;
    renderMenu(selectedCategory);
    button.classList.add("active");
    button.disabled = true;
    menuGrid.classList.add("collapsed");
  });

  //Render Menu-page
  function renderMenu(selectedCategory) {

    const filteredData = menuData.filter(
      (item) => item.category === selectedCategory,
    );

    const menuDataArr = menuData.map((item, index) => {
      const { category, image, name, description, price } = item;
      if (category === selectedCategory) {
        return `
            <div class="menu_card ${category}_${index + 1}">
              <div class="menu_img_container">
                <img class="img_card" src="${image}"
              alt="">
              </div>
              <div class="description">
                <h3 class="card_description_title">${name}</h3>
                <p class="card_description_text">${description}</p>
                <p class="card_description_price">$${price.toFixed(2)}</p>
              </div>
            </div>
        `;
      }
    });

    menuGrid.innerHTML = menuDataArr.join("");

    if (filteredData.length > 4) {
      uploadBtn.style.display = "block";
    } else {
      uploadBtn.style.display = "none";
    }
  }

  renderMenu(selectedCategory);
}

//Expended more cards
uploadBtn.addEventListener("click", () => {
  menuGrid.classList.remove("collapsed");
  uploadBtn.style.display = "none";
});

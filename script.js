import { menuData } from "./data.js";

let selectedCategory = "Coffee";

//Check saved theme
const themeSwitch = document.querySelector(".theme_switch");
const sunBtn = document.querySelector("#sun_btn");
const moonBtn = document.querySelector("#moon_btn");

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

const menuGrid = document.querySelector(".menu_grid");
const tabsContainer = document.querySelector(".tabs_container");
const tabItem = document.querySelectorAll(".tab_item");
const uploadBtn = document.querySelector("#upload_btn");

if (tabsContainer) {
  tabsContainer.addEventListener("click", function (e) {
    const button = e.target.closest(".tab_item");

    if (!button) return;

    tabItem.forEach((item) => {
      item.classList.remove("active_tab");
      item.disabled = false;
    });

    selectedCategory = button.dataset.category;

    if (window.innerWidth <= 768) {
      menuGrid.classList.add("collapsed");
    }

    renderMenu(selectedCategory);

    button.classList.add("active_tab");
    button.disabled = true;
  });

  renderMenu(selectedCategory);
}

//Render Menu-page
function renderMenu(selectedCategory) {
  const filteredData = menuData.filter(
    (item) => item.category === selectedCategory,
  );

  const menuDataArr = filteredData.map((item, index) => {
    const { category, image, name, description, price } = item;

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
  });

  menuGrid.innerHTML = menuDataArr.join("");

  if (
    filteredData.length > 4 &&
    window.innerWidth <= 768 &&
    menuGrid.classList.contains("collapsed")
  ) {
    uploadBtn.style.display = "block";
  } else {
    uploadBtn.style.display = "none";
  }
}

//Expended more cards
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    menuGrid.classList.remove("collapsed");
    uploadBtn.style.display = "none";
  });
}

//Burger menu
const burgerWrapper = document.querySelector(".burger_wrapper");
const burgerDefault = document.querySelector("#burger_default");
const burgerActive = document.querySelector("#burger_active");
const headerList = document.querySelector(".header_list");
const headerLinks = document.querySelectorAll(".header_link");
const menuLinkBurger = document.querySelector(".menu_link_burger");

burgerDefault.addEventListener("click", openBurgerMenu);

burgerActive.addEventListener("click", closeBurgerMenu);

headerLinks.forEach((link) => {
  link.addEventListener("click", closeBurgerMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && headerList.classList.contains("active_menu")) {
    closeBurgerMenu();
  }
});

//Resize page
let smallScreen = window.innerWidth <= 768;

window.addEventListener("resize", () => {
  const nowSmallScreen = window.innerWidth <= 768;

  if (menuGrid) {
    if (nowSmallScreen !== smallScreen) {
      if (nowSmallScreen) {
        menuGrid.classList.add("collapsed");
      } else {
        menuGrid.classList.remove("collapsed");
      }

      renderMenu(selectedCategory);

      smallScreen = nowSmallScreen;
    }
  }

  if (
    window.innerWidth >= 769 &&
    headerList.classList.contains("active_menu")
  ) {
    closeBurgerMenu();
  }
});

function openBurgerMenu() {
  burgerWrapper.classList.add("active");
  headerList.classList.add("active_menu");
  document.body.classList.add("menu_open");
  menuLinkBurger.classList.remove("hidden");
}

function closeBurgerMenu() {
  burgerWrapper.classList.remove("active");
  headerList.classList.remove("active_menu");
  document.body.classList.remove("menu_open");
  menuLinkBurger.classList.add("hidden");
}

//Slider (carousel)
const sliderTrack = document.querySelector(".slider_track");
const nextBtn = document.querySelector(".next_btn");
const prevBtn = document.querySelector(".prev_btn");
const slides = document.querySelectorAll(".favorite_content");
const controls = document.querySelectorAll(".control");

let currentSlide = 0;

if (sliderTrack) {
  nextBtn.addEventListener("click", () => {
    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    showSlide();
  });

  prevBtn.addEventListener("click", () => {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    showSlide();
  });

  controls.forEach((control, index) => {
    control.addEventListener("click", () => {
      currentSlide = index;

      updateControls();
      showSlide();
    });
  });
}

function showSlide() {
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateControls();
}

function updateControls() {
  controls.forEach((control, index) => {
    if (index === currentSlide) {
      control.classList.add("control_active");
    } else {
      control.classList.remove("control_active");
    }
  });
}

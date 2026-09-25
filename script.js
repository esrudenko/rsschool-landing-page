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
    const { category, image, name, description, price, id } = item;

    return `
            <div class="menu_card ${category}_${index + 1}" data-id="${id}">
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
  if (event.key === "Escape" && document.body.classList.contains("modal_open")) {
    closeModal();
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

//Modals
const modalContainer = document.querySelector(".modal_container");
const modalOverlay = document.querySelector(".modal_overlay");

if (menuGrid) {
  menuGrid.addEventListener("click", openModal);
}

modalContainer.addEventListener("click", (e) => {
  if(e.target.closest('.close_modal_btn')) {
    closeModal();
  }
})

modalOverlay.addEventListener("click", (e) => {
  if(!e.target.closest('.modal_container')) {
    closeModal();
  }
})

function openModal(e) {
    const card = e.target.closest(".menu_card");

    if (!card) return;

    const id = Number(card.dataset.id);
    const product = menuData.find((item) => item.id === id);

    modalOverlay.style.display = "flex";
    modalContainer.innerHTML = `
        <div class="modal_img_container">
              <img class="modal_img" src="${product.image}">
            </div>
            <div class="modal_content">
              <div class="modal_description">
                <h3 class="modal_title">${product.name}</h3>
                <p class="modal_text">${product.description}</p>
              </div>
              <div class="option_group">
                <p class="option_title">Size</p>
                <div class="option_list">
                  <button class="tab_item active_tab">
                    <span class="option_badge">S</span>
                    <span class="option_text">${product.size[0]}</span>
                  </button>
                  <button class="tab_item">
                    <span class="option_badge">M</span>
                    <span class="option_text">${product.size[1]}</span>
                  </button>
                  <button class="tab_item">
                    <span class="option_badge">L</span>
                    <span class="option_text">${product.size[2]}</span>
                  </button>
                </div>
              </div>
              <div class="option_group">
                <p class="option_title">Additives</p>
                <div class="option_list">
                  <button class="tab_item">
                    <span class="option_badge">1</span>
                    <span class="option_text">${product.additives[0]}</span>
                  </button>
                  <button class="tab_item">
                    <span class="option_badge">2</span>
                    <span class="option_text">${product.additives[1]}</span>
                    </button>
                  <button class="tab_item">
                    <span class="option_badge">3</span>
                    <span class="option_text">${product.additives[2]}</span>
                  </button>
                </div>
              </div>
              <div class="total_row">
                <p class="total_label">Total:</p>
                <p class="total_price">$${product.price.toFixed(2)}</p>
              </div>
              <div class="modal_note">
                <svg class="modal_note_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_147811_7672)">
                  <path d="M8 7.66663V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 5.00667L8.00667 4.99926" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_147811_7672">
                  <rect width="16" height="16" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
                <p class="modal_note_text">
                  The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
                </p>
              </div>
              <button class="close_modal_btn">Close</button>
            </div> 
        `;
        document.body.classList.add("modal_open");
}

function closeModal() {
    modalOverlay.style.display = "none";
    document.body.classList.remove("modal_open");
}

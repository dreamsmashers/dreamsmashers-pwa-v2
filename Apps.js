// ==========================
// DREAMSMASHERS V2 - FULL APP.JS
// ==========================
document.addEventListener("DOMContentLoaded", () => {

  // --------------------------
  // SCREEN TRANSITION
  // --------------------------
  const openingScreen = document.getElementById("opening-screen");
  const mainScreen = document.getElementById("main-screen");
  const pressStartBtn = document.getElementById("press-start");

  pressStartBtn.addEventListener("click", () => {
    openingScreen.classList.remove("active");
    mainScreen.classList.add("active");
    clearInterval(fallInterval);
  });

  // --------------------------
  // FALLING PIXEL ITEMS
  // --------------------------
  const fallContainer = document.getElementById("falling-container");
  const fallItems = ["🍔","🍕","🍟","🍹","🥤","🎮","🕹","👾","🍺","🍩"];
  function spawnFallItem() {
    const item = document.createElement("span");
    item.textContent = fallItems[Math.floor(Math.random() * fallItems.length)];
    item.style.left = Math.random() * 100 + "vw";
    item.style.animationDuration = (3 + Math.random() * 4) + "s";
    fallContainer.appendChild(item);
    setTimeout(() => item.remove(), 7000);
  }
  const fallInterval = setInterval(spawnFallItem, 500);

  // --------------------------
  // MODAL SYSTEM
  // --------------------------
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");
  function openModal(html) {
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
  }
  modalClose.onclick = () => modal.classList.add("hidden");

  // --------------------------
  // CART SYSTEM
  // --------------------------
  let cart = [];
  const cartIcon = document.getElementById("cart-icon");
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartBin = document.getElementById("cart-bin");
  const closeCart = document.getElementById("close-cart");

  cartIcon.onclick = () => cartPanel.classList.add("open");
  closeCart.onclick = () => cartPanel.classList.remove("open");

  // --------------------------
  // CART FUNCTIONS - VISUAL GRID
  // --------------------------
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    // create grid container
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))";
    grid.style.gap = "10px";

    cart.forEach(item => {
      total += item.price * item.qty;

      const box = document.createElement("div");
      box.classList.add("cart-box");
      box.draggable = true;
      box.dataset.name = item.name;
      box.dataset.price = item.price;
      box.dataset.qty = item.qty;

      box.style.border = "2px solid #777";
      box.style.padding = "8px";
      box.style.background = "#1a1a1a";
      box.style.textAlign = "center";
      box.style.cursor = "grab";

      box.innerHTML = `<div style="font-size:24px;">🍔</div>
                       <div style="font-size:12px;">${item.name}</div>
                       <div style="font-size:12px;">x${item.qty}</div>
                       <div style="font-size:12px;">£${item.price}</div>`;

      grid.appendChild(box);
    });

    cartItems.appendChild(grid);
    cartTotal.textContent = "£" + total.toFixed(2);
    updateXP(total);
  }

  function addToCart(name, price, qty = 1) {
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += qty;
    else cart.push({ name, price, qty });
    updateCart();
  }

  // Drag-to-bin functionality
  cartItems.addEventListener("dragstart", e => {
    if (e.target.classList.contains("cart-box")) {
      e.dataTransfer.setData("text/plain", e.target.dataset.name);
    }
  });

  cartBin.addEventListener("dragover", e => e.preventDefault());

  cartBin.addEventListener("drop", e => {
    e.preventDefault();
    const name = e.dataTransfer.getData("text/plain");
    const item = cart.find(i => i.name === name);
    if (item) {
      // Split-stack confirmation
      let removeQty = prompt(`Remove how many of "${name}"? (Max ${item.qty})`, item.qty);
      removeQty = parseInt(removeQty);
      if (!isNaN(removeQty) && removeQty > 0) {
        if (removeQty >= item.qty) {
          cart = cart.filter(i => i.name !== name);
        } else {
          item.qty -= removeQty;
        }
        updateCart();
      }
    }
  });

  // --------------------------
  // XP / BATTLE PASS
  // --------------------------
  let xp = 0;
  let level = 1;
  function xpRequired(lvl) { return 100 + (lvl - 1) * 50; }
  function updateXP(totalSpend) { xp = Math.floor(totalSpend * 2.5); }
  function battlePassHTML() {
    let html = `<h2>Battle Pass</h2>
      <p>Level ${level} — XP ${xp}/${xpRequired(level)}</p>
      <progress value="${xp}" max="${xpRequired(level)}"></progress>
      <ul>`;
    for (let i = 1; i <= 30; i++) html += `<li>Level ${i}: Reward ${i}</li>`;
    html += "</ul>";
    return html;
  }

  // --------------------------
  // MENU DATA
  // --------------------------
  const drinks = [
    ["Critical Hit IPA", 6.5],
    ["Mana Potion", 7],
    ["Pixel Punch", 8],
    ["Boss Fight Bourbon", 7.5],
    ["Respawn Rum", 7],
    ["Lag Spike Lager", 5.5],
    ["Stealth Gin", 6.5],
    ["XP Boost Shot", 4],
    ["Neon Night Vodka", 6],
    ["Final Boss Cocktail", 9],
    ["8-Bit Cola", 3],
    ["Health Regen Fizz", 3],
    ["AFK Lemonade", 2.8],
    ["Power-Up Energy", 3.5],
    ["Noob Orange", 2.5]
  ];

  const food = Array.from({ length: 20 }, (_, i) => [
    `Player ${i + 1} Burger`,
    8 + (i % 5)
  ]);

  // --------------------------
  // SECTION HANDLER
  // --------------------------
  document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      if (section === "drinks") openModal(disclaimerHTML("Drinks", drinks));
      if (section === "food") openModal(disclaimerHTML("Food", food));
      if (section === "events") openModal(eventsHTML());
      if (section === "battlepass") openModal(battlePassHTML());
      if (section === "nutrition") openModal(nutritionHTML());
      if (section === "allergens") openModal(allergensHTML());
    });
  });

  // --------------------------
  // DISCLAIMER + MENU RENDERING
  // --------------------------
  function disclaimerHTML(title, items) {
    return `
      <h2>${title} Notice</h2>
      <p>Allergen info available in the Allergens section.</p>
      <button id="agree">I Agree</button>
    `;
  }

  modal.addEventListener("click", e => {
    if (e.target.id === "agree") {
      const title = modalContent.querySelector("h2").textContent;
      if (title.includes("Drinks")) renderMenu("drinks", drinks);
      if (title.includes("Food")) renderMenu("food", food);
    }
  });

  function renderMenu(type, items) {
    let html = `<h2>${type.charAt(0).toUpperCase() + type.slice(1)} Menu</h2><ul>`;
    items.forEach(([name, price]) => {
      html += `<li>${name} (£${price}) <button class="add-btn" data-name="${name}" data-price="${price}">Add to Cart</button></li>`;
    });
    html += "</ul>";
    modalContent.innerHTML = html;

    modalContent.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
      });
    });
  }

  // --------------------------
  // OTHER SECTIONS
  // --------------------------
  function eventsHTML() {
    return `<h2>Events</h2>
      <ul>
        <li>Street Fighter Tournament</li>
        <li>Mario Kart League</li>
        <li>Board Game Bash</li>
        <li>Pokémon GO Night</li>
        <li>Retro Arcade Championship</li>
        <li>Live DJ + Chiptune</li>
        <li>DnD One-Shot</li>
        <li>Cosplay Party</li>
      </ul>`;
  }

  function nutritionHTML() {
    return "<h2>Nutrition</h2><p>Calories and nutrients listed per item.</p>";
  }

  function allergensHTML() {
    return `
      <div class="allergen-table">
        <h2>Allergen Information</h2>
        <table>
          <tr><th>Item</th><th>Allergens</th></tr>
          <tr><td>Burgers</td><td>Gluten, Dairy</td></tr>
          <tr><td>Cocktails</td><td>Sulphites</td></tr>
          <tr><td>Desserts</td><td>Dairy, Eggs</td></tr>
        </table>
      </div>
    `;
  }

});

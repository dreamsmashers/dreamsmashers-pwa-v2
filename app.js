document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SCREEN TRANSITION
  ========================= */
  const openingScreen = document.getElementById("opening-screen");
  const mainScreen = document.getElementById("main-screen");
  const pressStart = document.getElementById("press-start");

  pressStart.addEventListener("click", () => {
    openingScreen.classList.remove("active");
    mainScreen.classList.add("active");
    clearInterval(fallInterval);
  });

  /* =========================
     FALLING PIXEL ITEMS
  ========================= */
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

  /* =========================
     MODAL SYSTEM
  ========================= */
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  function openModal(html) {
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
  }

  modalClose.onclick = () => modal.classList.add("hidden");

  /* =========================
     INVENTORY / CART
  ========================= */
  let cart = [];

  const cartIcon = document.getElementById("cart-icon");
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const closeCart = document.getElementById("close-cart");
  const cartBin = document.getElementById("cart-bin");

  cartIcon.onclick = () => cartPanel.classList.add("open");
  closeCart.onclick = () => cartPanel.classList.remove("open");

  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const div = document.createElement("div");
      div.textContent = `${item.name} x${item.qty} (£${item.price})`;
      div.draggable = true;

      div.addEventListener("dragstart", () => {
        div.dataset.index = index;
      });

      cartItems.appendChild(div);
    });

    cartTotal.textContent = "£" + total.toFixed(2);
    updateXP(total);
  }

  function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1 });
    updateCart();
  }

  /* Drag-to-bin */
  cartBin.addEventListener("dragover", e => e.preventDefault());
  cartBin.addEventListener("drop", e => {
    const index = e.dataTransfer?.getData("text");
    if (index !== undefined) {
      cart.splice(index, 1);
      updateCart();
    }
  });

  /* =========================
     XP / BATTLE PASS
  ========================= */
  let xp = 0;
  let level = 1;

  function xpRequired(lvl) {
    return 100 + (lvl - 1) * 50;
  }

  function updateXP(totalSpend) {
    xp = Math.floor(totalSpend * 2.5);
    level = 1;
    while (xp >= xpRequired(level)) {
      xp -= xpRequired(level);
      level++;
    }
  }

  function battlePassHTML() {
    let html = `
      <h2>Battle Pass</h2>
      <p>Level ${level}</p>
      <progress value="${xp}" max="${xpRequired(level)}"></progress>
      <ul>
    `;
    for (let i = 1; i <= 30; i++) {
      html += `<li>Level ${i} – Reward ${i}</li>`;
    }
    html += "</ul>";
    return html;
  }

  /* =========================
     DATA
  ========================= */
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

  /* =========================
     MENU RENDERERS
  ========================= */
  function menuHTML(title, items) {
    let html = `<h2>${title}</h2><ul class="menu-list">`;
    items.forEach(([name, price]) => {
      html += `
        <li class="menu-item">
          <span>${name}</span>
          <span>£${price.toFixed(2)}</span>
          <button onclick="window.addItem('${name}', ${price})">Add</button>
        </li>
      `;
    });
    html += "</ul>";
    return html;
  }

  window.addItem = addToCart;

  function disclaimerHTML(title, items) {
    return `
      <h2>${title} Notice</h2>
      <p>Please review allergen information before ordering.</p>
      <button id="agree-btn">I Agree</button>
    `;
  }

  /* =========================
     ICON GRID HANDLER
  ========================= */
  document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;

      if (section === "drinks") {
        openModal(disclaimerHTML("Drinks", drinks));
        modalContent.onclick = e => {
          if (e.target.id === "agree-btn") {
            modalContent.innerHTML = menuHTML("Drinks Menu", drinks);
          }
        };
      }

      if (section === "food") {
        openModal(disclaimerHTML("Food", food));
        modalContent.onclick = e => {
          if (e.target.id === "agree-btn") {
            modalContent.innerHTML = menuHTML("Food Menu", food);
          }
        };
      }

      if (section === "events") {
        openModal(`
          <h2>Events</h2>
          <ul>
            <li>Street Fighter Tournament</li>
            <li>Mario Kart League</li>
            <li>Board Game Bash</li>
            <li>Pokémon GO Night</li>
            <li>Retro Arcade Championship</li>
            <li>Live DJ + Chiptune</li>
            <li>D&D One-Shot</li>
            <li>Cosplay Party</li>
          </ul>
        `);
      }

      if (section === "battlepass") {
        openModal(battlePassHTML());
      }

      if (section === "nutrition") {
        openModal("<h2>Nutrition</h2><p>Nutrition info available per item.</p>");
      }

      if (section === "allergens") {
        openModal(`
          <div class="allergen-table">
            <h2>Allergen Information</h2>
            <table>
              <tr><th>Item</th><th>Allergens</th></tr>
              <tr><td>Burgers</td><td>Gluten, Dairy</td></tr>
              <tr><td>Cocktails</td><td>Sulphites</td></tr>
              <tr><td>Desserts</td><td>Dairy, Eggs</td></tr>
            </table>
          </div>
        `);
      }
    });
  });

});

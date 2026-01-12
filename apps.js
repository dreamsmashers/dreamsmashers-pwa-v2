document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // SCREENS
  // =========================
  const openingScreen = document.getElementById("opening-screen");
  const mainScreen = document.getElementById("main-screen");
  const pressStartBtn = document.getElementById("press-start");

  pressStartBtn.addEventListener("click", () => {
    openingScreen.classList.remove("active");
    mainScreen.classList.add("active");
    clearInterval(fallInterval);
  });

  // =========================
  // FALLING ITEMS
  // =========================
  const fallContainer = document.getElementById("falling-container");
  const fallItems = ["🍔","🍕","🍟","🍹","🥤","🎮","🕹","👾","🍺","🍩"];

  function spawnFallItem() {
    const item = document.createElement("span");
    item.textContent = fallItems[Math.floor(Math.random()*fallItems.length)];
    item.style.left = Math.random()*100+"vw";
    item.style.animationDuration = (3+Math.random()*4)+"s";
    fallContainer.appendChild(item);
    setTimeout(()=>item.remove(),7000);
  }

  const fallInterval = setInterval(spawnFallItem, 500);

  // =========================
  // MODAL
  // =========================
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  function openModal(html){
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
  }

  modalClose.onclick = ()=>modal.classList.add("hidden");

  // =========================
  // CART
  // =========================
  let cart = [];
  const cartIcon = document.getElementById("cart-icon");
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const closeCart = document.getElementById("close-cart");
  const cartBin = document.getElementById("cart-bin");

  cartIcon.onclick = ()=>cartPanel.classList.add("open");
  closeCart.onclick = ()=>cartPanel.classList.remove("open");

  function updateCart(){
    cartItems.innerHTML="";
    let total=0;
    cart.forEach(item=>{
      total+=item.price*item.qty;
      const div=document.createElement("div");
      div.className="cart-box";
      div.innerHTML=`<div>${item.emoji}</div><div>${item.name}</div><div>x${item.qty}</div><div>£${item.price}</div>`;
      cartItems.appendChild(div);
    });
    cartTotal.textContent="£"+total.toFixed(2);
  }

  function addToCart(name, price, emoji="🍔"){
    const existing=cart.find(i=>i.name===name);
    if(existing) existing.qty++;
    else cart.push({name,price,qty:1,emoji});
    updateCart();
  }

  // Drag over effect for cart bin
  cartItems.addEventListener("dragover", e=>{
    e.preventDefault();
    cartBin.classList.add("drag-over");
  });
  cartItems.addEventListener("dragleave", e=>{
    cartBin.classList.remove("drag-over");
  });

  // =========================
  // MENU DATA
  // =========================
  const drinks=[
    ["Critical Hit IPA",6.5,"🍺"],
    ["Mana Potion",7,"🥤"],
    ["Pixel Punch",8,"🍹"],
    ["Boss Fight Bourbon",7.5,"🥃"]
  ];

  const food=[
    ["Player 1 Burger",8,"🍔"],
    ["Player 2 Pizza",9,"🍕"]
  ];

  // =========================
  // ICON HANDLER
  // =========================
  document.querySelectorAll(".icon-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const section=btn.dataset.section;

      if(section==="drinks") openModal(disclaimerHTML("Drinks",drinks));
      if(section==="food") openModal(disclaimerHTML("Food",food));
      if(section==="events") openModal(`<h2>Events</h2><ul><li>Street Fighter Tournament</li><li>Mario Kart League</li></ul>`);
      if(section==="battlepass") openModal("<h2>Battle Pass</h2><p>XP/Rewards here</p>");
      if(section==="nutrition") openModal("<h2>Nutrition</h2><p>Calories and nutrients listed per item.</p>");
      if(section==="allergens") openModal(`<div class="allergen-table"><h2>Allergen Information</h2><table><tr><th>Item</th><th>Allergens</th></tr><tr><td>Burgers</td><td>Gluten,Dairy</td></tr></table></div>`);
    });
  });

  function disclaimerHTML(title,items){
    let html=`<h2>${title} Notice</h2><p>Allergen info available in Allergens section.</p><button id="agree">I Agree</button>`;
    setTimeout(()=>{
      const agreeBtn=document.getElementById("agree");
      if(agreeBtn) agreeBtn.onclick=()=>{
        let menuHTML="<div>";
        items.forEach(i=>menuHTML+=`<div class="cart-box"><div>${i[2]}</div><div>${i[0]}</div><div>x1</div><div>£${i[1]}</div></div>`);
        menuHTML+="</div>";
        modalContent.innerHTML=menuHTML;
        modalContent.innerHTML+=`<button id="modal-close">Close</button>`;
        document.getElementById("modal-close").onclick=()=>modal.classList.add("hidden");
      };
    },50);
    return html;
  }

});

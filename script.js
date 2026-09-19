const products = [
  {
    id: 1,
    name: "Classic Sneakers",
    price: 450,
    category: "sneakers",
    image: "assets/file_000000000f748210807dd1f59bf317cb.png"
  },
  {
    id: 2,
    name: "Premium Casual Shoes",
    price: 380,
    category: "casual",
    image: "assets/file_000000006198820a81bf3ecc45e4829a.png"
  },
  {
    id: 3,
    name: "Sport Running Shoes",
    price: 400,
    category: "sports",
    image: "assets/file_0000000080f08210b78abcbbccb5d0c8.png"
  },
  {
    id: 4,
    name: "Elegant Formal Shoes",
    price: 500,
    category: "formal",
    image: "assets/file_00000000a94c81f4982b62931c167f68.png"
  },
  {
    id: 5,
    name: "Fashion Sneakers",
    price: 480,
    category: "sneakers",
    image: "assets/shoe5.jpg"
  },
  {
    id: 6,
    name: "Everyday Casual Shoes",
    price: 750,
    category: "casual",
    image: "assets/shoe6.jpg"
  }
];
let cart=JSON.parse(localStorage.getItem("dannyCart")||"[]");
let currency=localStorage.getItem("dannyCurrency")||"K";

function money(n){return currency+n.toLocaleString()}
function renderProducts(list=products, target="productGrid"){
 const el=document.getElementById(target); if(!el)return;
 el.innerHTML=list.map(p=>`<article class="product">
   <div class="product-img">${p.icon}</div>
   <div class="product-info"><span class="tag">${p.tag}</span><h3>${p.name}</h3>
   <div><span class="price">${money(p.price)}</span><span class="old">${money(p.old)}</span></div>
   <div class="product-actions"><button onclick="addToCart(${p.id})" class="add">Add to Cart</button><button onclick="quickOrder(${p.id})">Order</button></div></div>
 </article>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);let item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();toast(p.name+" added to cart");}
function saveCart(){if(document.getElementById("saveCartToggle")?.checked!==false)localStorage.setItem("dannyCart",JSON.stringify(cart));updateCart()}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML="<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent=money(0);return}
 let total=0;
 box.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `<div class="cart-row"><div><b>${p.name}</b><br>${money(p.price)} × ${i.qty}<div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> <button onclick="changeQty(${p.id},1)">+</button></div></div><button onclick="removeCart(${p.id})">🗑️</button></div>`}).join("");
 document.getElementById("cartTotal").textContent=money(total);
}
function changeQty(id,d){let i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function openCart(){updateCart();document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function closeAll(){closeCart();closeSearch();closeSettings()}
function checkout(){
 if(!cart.length){toast("Your cart is empty");return}
 let lines=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `${p.name} x${i.qty} - ${money(p.price*i.qty)}`}).join("%0A");
 let total=cart.reduce((s,i)=>s+products.find(x=>x.id===i.id).price*i.qty,0);
 let msg=`Hello Danny's Shoe Store! I would like to order:%0A${lines}%0A%0ATotal: ${money(total)}%0APlease confirm availability, size and delivery.`;
 window.open("https://wa.me/260977388313?text="+msg,"_blank");
}
function quickOrder(id){addToCart(id);openCart()}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.cat==="all"?products:products.filter(p=>p.cat===b.dataset.cat))}));
function toggleMenu(){document.getElementById("mainNav").classList.toggle("open")}
function openSearch(){document.getElementById("searchModal").classList.add("open");document.getElementById("searchInput").focus()}
function closeSearch(){document.getElementById("searchModal").classList.remove("open")}
function searchProducts(){let q=document.getElementById("searchInput").value.toLowerCase();let r=products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q));document.getElementById("searchResults").innerHTML=r.map(p=>`<div class="search-item" onclick="addToCart(${p.id});closeSearch()"><b>${p.name}</b> — ${money(p.price)}</div>`).join("")||"<p>No products found.</p>"}
function openSettings(){document.getElementById("settingsModal").classList.add("open");document.getElementById("darkToggle").checked=document.body.classList.contains("dark");document.getElementById("currency").value=currency}
function closeSettings(){document.getElementById("settingsModal").classList.remove("open")}
function toggleDark(on){document.body.classList.toggle("dark",on)}
function saveSettings(){currency=document.getElementById("currency").value;localStorage.setItem("dannyCurrency",currency);localStorage.setItem("dannyDark",document.getElementById("darkToggle").checked);saveCart();renderProducts();renderProducts(products.filter(p=>p.new),"newGrid");closeSettings();toast("Settings saved")}
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
document.getElementById("bookingForm").addEventListener("submit",e=>{e.preventDefault();let f=new FormData(e.target);let msg=`Hello Danny's Shoe Store!%0A%0ABooking request:%0AName: ${f.get("name")}%0APhone: ${f.get("phone")}%0ADate: ${f.get("date")}%0ATime: ${f.get("time")}%0AService: ${f.get("service")}%0APeople: ${f.get("people")}%0AMessage: ${f.get("message")||"None"}`;window.open("https://wa.me/260977388313?text="+msg,"_blank");toast("Opening WhatsApp to confirm your booking")});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
if(localStorage.getItem("dannyDark")==="true")document.body.classList.add("dark");
renderProducts();renderProducts(products.filter(p=>p.new),"newGrid");updateCart();

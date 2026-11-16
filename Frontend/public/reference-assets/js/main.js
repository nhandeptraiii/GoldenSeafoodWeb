/* =========================================================
   GOLDEN SEAFOOD — main.js
========================================================= */
(function(){
  "use strict";

  /* ---------- Always open a fresh page at the top ----------
     Some hosting/preview contexts (and the browser's own back/forward
     cache) restore the scroll position a URL had last time it was shown,
     instead of starting a brand-new navigation at the top. That makes a
     plain link to another page (e.g. "Talk to Sourcing Team" -> contact.html)
     land wherever that page happened to be scrolled before. Force every
     fresh load/navigation (without a #fragment target) back to the top. */
  if("scrollRestoration" in history){ history.scrollRestoration = "manual"; }
  if(!location.hash){ window.scrollTo(0,0); }
  window.addEventListener("pageshow", function(){
    if(!location.hash){ window.scrollTo(0,0); }
  });

  /* ---------- Loader ---------- */
  window.addEventListener("load", function(){
    var loader = document.querySelector(".loader");
    if(loader){ setTimeout(function(){ loader.classList.add("hide"); }, 250); }
  });

  /* ---------- Language toggle ---------- */
  var LANG_KEY = "gs_lang";
  function applyLang(lang){
    document.documentElement.classList.toggle("lang-vi", lang === "vi");
    document.querySelectorAll(".lang-switch button").forEach(function(b){
      b.classList.toggle("active", b.dataset.langBtn === lang);
    });
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
  }
  document.addEventListener("click", function(e){
    var btn = e.target.closest("[data-lang-btn]");
    if(btn){ applyLang(btn.dataset.langBtn); }
  });
  (function initLang(){
    var saved = "en";
    try{ saved = localStorage.getItem(LANG_KEY) || "en"; }catch(e){}
    applyLang(saved);
  })();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");
  var overlay = document.querySelector(".nav-overlay");
  function closeNav(){ nav && nav.classList.remove("open"); overlay && overlay.classList.remove("open"); }
  if(burger){
    burger.addEventListener("click", function(){
      nav.classList.add("open"); overlay.classList.add("open");
    });
  }
  document.addEventListener("click", function(e){
    if(e.target.closest(".nav-close") || e.target.classList.contains("nav-overlay")) closeNav();
  });
  document.querySelectorAll(".main-nav a").forEach(function(a){ a.addEventListener("click", closeNav); });

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  var backTop = document.querySelector(".float-btn.top");
  window.addEventListener("scroll", function(){
    var y = window.scrollY;
    if(header) header.style.boxShadow = y > 10 ? "0 4px 20px rgba(0,0,0,.18)" : "none";
    if(backTop) backTop.classList.toggle("show", y > 500);
  });
  if(backTop){ backTop.addEventListener("click", function(){ window.scrollTo({top:0,behavior:"smooth"}); }); }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    document.documentElement.classList.add("js-reveal-ready");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },{threshold:.1, rootMargin:"0px 0px -40px 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
    // Safety net: never leave content invisible for more than a couple seconds
    setTimeout(function(){ revealEls.forEach(function(el){ el.classList.add("in"); }); }, 2500);
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---------- Value chain progressive line ---------- */
  var vchain = document.querySelector(".vchain");
  if(vchain){
    var steps = vchain.querySelectorAll(".vstep");
    var fill = vchain.querySelector(".vchain-line-fill");
    var vio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var i = 0;
          var timer = setInterval(function(){
            if(i >= steps.length){ clearInterval(timer); return; }
            steps[i].classList.add("active");
            var pct = ((i+1)/steps.length)*100;
            if(fill){
              if(window.innerWidth <= 980){ fill.style.height = pct+"%"; } else { fill.style.width = pct+"%"; }
            }
            i++;
          }, 380);
          vio.unobserve(vchain);
        }
      });
    },{threshold:.3});
    vio.observe(vchain);
  }

  /* ---------- Cert strip infinite loop (duplicate content) ---------- */
  var certTrack = document.querySelector(".cert-track");
  if(certTrack){ certTrack.innerHTML += certTrack.innerHTML; }

  /* ---------- Toast ---------- */
  var toastEl = document.querySelector(".toast");
  var toastTimer;
  function toast(msgEn, msgVi, icon){
    if(!toastEl) return;
    var isVi = document.documentElement.classList.contains("lang-vi");
    toastEl.innerHTML = '<i class="bi '+(icon||'bi-check-circle-fill')+'"></i> '+(isVi?msgVi:msgEn);
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2800);
  }
  window.gsToast = toast;

  /* =========================================================
     INQUIRY BASKET (localStorage)
  ========================================================= */
  var BASKET_KEY = "gs_inquiry_basket";
  function getBasket(){
    try{ return JSON.parse(localStorage.getItem(BASKET_KEY)) || []; }catch(e){ return []; }
  }
  function setBasket(list){
    try{ localStorage.setItem(BASKET_KEY, JSON.stringify(list)); }catch(e){}
    renderBasket();
  }
  function addToBasket(item){
    var list = getBasket();
    if(list.some(function(i){return i.id === item.id;})){
      toast("Already in your inquiry list.", "Sản phẩm đã có trong danh sách.", "bi-info-circle-fill");
      return;
    }
    list.push(item);
    setBasket(list);
    toast("Added to inquiry list.", "Đã thêm vào danh sách báo giá.", "bi-cart-check-fill");
  }
  function removeFromBasket(id){
    setBasket(getBasket().filter(function(i){ return i.id !== id; }));
  }
  function renderBasket(){
    var list = getBasket();
    document.querySelectorAll(".badge-count").forEach(function(b){ b.textContent = list.length; b.style.display = list.length ? "flex" : "none"; });
    var body = document.querySelector(".drawer-body");
    var foot = document.querySelector(".drawer-foot");
    if(!body) return;
    if(!list.length){
      body.innerHTML = '<div class="drawer-empty"><i class="bi bi-basket2"></i>'+
        '<p><span data-lang="en">Your inquiry list is empty.</span><span data-lang="vi">Danh sách yêu cầu báo giá đang trống.</span></p></div>';
      if(foot) foot.style.display = "none";
    } else {
      body.innerHTML = list.map(function(i){
        return '<div class="drawer-item">'+
          '<img src="'+i.img+'" alt="">'+
          '<div style="flex:1"><strong>'+i.name+'</strong><span style="font-size:.78rem;color:var(--gray-500)">'+i.cat+'</span></div>'+
          '<button data-remove="'+i.id+'"><i class="bi bi-x-lg"></i></button></div>';
      }).join("");
      if(foot) foot.style.display = "block";
    }
    // reflect added state on product cards present on page
    document.querySelectorAll("[data-add-inquiry]").forEach(function(btn){
      var id = btn.getAttribute("data-add-inquiry");
      var added = list.some(function(i){return i.id === id;});
      btn.classList.toggle("added", added);
      var lbl = btn.querySelector("[data-btn-label]");
      if(lbl){
        lbl.innerHTML = added
          ? '<span data-lang="en">Added</span><span data-lang="vi">Đã thêm</span>'
          : '<span data-lang="en">Add to Inquiry</span><span data-lang="vi">Thêm vào báo giá</span>';
      }
    });
  }
  document.addEventListener("click", function(e){
    var addBtn = e.target.closest("[data-add-inquiry]");
    if(addBtn){
      addToBasket({
        id: addBtn.getAttribute("data-add-inquiry"),
        name: addBtn.getAttribute("data-name"),
        cat: addBtn.getAttribute("data-cat"),
        img: addBtn.getAttribute("data-img")
      });
      return;
    }
    var rmBtn = e.target.closest("[data-remove]");
    if(rmBtn){ removeFromBasket(rmBtn.getAttribute("data-remove")); return; }

    var basketOpener = e.target.closest("[data-open-basket]");
    if(basketOpener){
      document.querySelector(".drawer").classList.add("open");
      document.querySelector(".drawer-overlay").classList.add("open");
      return;
    }
    if(e.target.closest(".drawer-close") || e.target.classList.contains("drawer-overlay")){
      document.querySelector(".drawer").classList.remove("open");
      document.querySelector(".drawer-overlay").classList.remove("open");
    }
  });
  renderBasket();

  /* =========================================================
     PRODUCT FILTER (products.html)
  ========================================================= */
  var grid = document.querySelector("[data-product-grid]");
  if(grid){
    var cards = Array.from(grid.querySelectorAll(".product-card"));
    var catBtns = document.querySelectorAll("[data-filter-cat]");
    var typeChecks = document.querySelectorAll("[data-filter-type]");
    var activeCat = "all";

    function applyFilters(){
      var activeTypes = Array.from(typeChecks).filter(function(c){return c.checked;}).map(function(c){return c.dataset.filterType;});
      var visible = 0;
      cards.forEach(function(card){
        var cat = card.dataset.cat;
        var types = (card.dataset.type||"").split(",");
        var catOk = activeCat === "all" || cat === activeCat;
        var typeOk = !activeTypes.length || activeTypes.some(function(t){return types.indexOf(t) !== -1;});
        var show = catOk && typeOk;
        card.style.display = show ? "" : "none";
        if(show) visible++;
      });
      var empty = document.querySelector(".products-empty");
      if(empty) empty.style.display = visible ? "none" : "block";
    }
    catBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        catBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        activeCat = btn.dataset.filterCat;
        applyFilters();
      });
    });
    typeChecks.forEach(function(c){ c.addEventListener("change", applyFilters); });

    // deep-link via ?cat=
    var params = new URLSearchParams(window.location.search);
    var catParam = params.get("cat");
    if(catParam){
      var target = document.querySelector('[data-filter-cat="'+catParam+'"]');
      if(target) target.click();
    }
  }

  /* ---------- Accordion (processing.html) ---------- */
  document.querySelectorAll(".accordion-head").forEach(function(head){
    head.addEventListener("click", function(){
      var item = head.closest(".accordion-item");
      var group = item.parentElement;
      var wasOpen = item.classList.contains("open");
      // Single-open accordion: close any other open item first, instantly
      // (no transition) so the layout is stable before we scroll — this is
      // what keeps the newly-opened item from ending up off-screen.
      group.querySelectorAll(".accordion-item.open").forEach(function(openItem){
        if(openItem === item) return;
        var body = openItem.querySelector(".accordion-body");
        if(body){ body.style.transition = "none"; }
        openItem.classList.remove("open");
        if(body){ body.offsetHeight; body.style.transition = ""; }
      });
      item.classList.toggle("open", !wasOpen);
      if(!wasOpen){
        // Scroll the clicked item into view just below the sticky header.
        var headerEl = document.querySelector(".site-header");
        var headerH = headerEl ? headerEl.offsetHeight : 80;
        var rect = item.getBoundingClientRect();
        var targetY = window.scrollY + rect.top - headerH - 16;
        window.scrollTo({top: Math.max(targetY,0), behavior: "smooth"});
      }
    });
  });

  /* ---------- Forms (contact / inquiry) — static demo submit ---------- */
  document.querySelectorAll("form[data-ajax-form]").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var wrap = form.closest(".form-card") || form.parentElement;
      form.style.display = "none";
      var success = wrap.querySelector(".form-success");
      if(success) success.classList.add("show");
      toast("Message sent successfully.", "Gửi yêu cầu thành công.", "bi-check-circle-fill");
      // Also open a mailto as fallback for a truly static site
      var mailto = form.getAttribute("data-mailto");
      if(mailto){
        try{
          var data = new FormData(form);
          var lines = [];
          data.forEach(function(v,k){ if(v) lines.push(k+": "+v); });
          var body = encodeURIComponent(lines.join("\n"));
          var subject = encodeURIComponent(form.getAttribute("data-subject") || "New Inquiry — Golden Seafood Website");
          // not auto-opening to avoid interrupting the demo flow; left available if needed
          form.dataset.mailtoHref = "mailto:"+mailto+"?subject="+subject+"&body="+body;
        }catch(err){}
      }
    });
  });

  /* current year */
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* active nav link */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a[data-page]").forEach(function(a){
    if(a.dataset.page === path) a.classList.add("active");
  });

})();

(function(){
  'use strict';
  var body=document.body;
  var toggle=document.getElementById('themeToggle');
  var logo=document.querySelector('[data-brand-wordmark]');
  try{ if(localStorage.getItem('nentric-theme')==='dark') body.classList.add('dark-theme'); }catch(e){}
  function syncTheme(){
    document.documentElement.classList.remove('nentric-dark-preload');
    if(toggle) toggle.setAttribute('aria-pressed',body.classList.contains('dark-theme')?'true':'false');
    if(logo){ var next=body.classList.contains('dark-theme')?logo.getAttribute('data-dark'):logo.getAttribute('data-light'); if(next) logo.src=next; }
    var favicon=document.getElementById('themeFavicon'); if(favicon) favicon.href='assets/favicon-orange.png';
    if(toggle) toggle.setAttribute('aria-label',body.classList.contains('dark-theme')?'Switch to bright theme':'Switch to dark theme');
  }
  syncTheme();
  if(toggle) toggle.addEventListener('click',function(){
    var dark=body.classList.toggle('dark-theme');
    try{localStorage.setItem('nentric-theme',dark?'dark':'light');}catch(e){}
    syncTheme();
  });

  var menuButton=document.getElementById('mobileMenuToggle');
  var menu=document.getElementById('mobileMenu');
  var close=document.getElementById('mobileMenuClose');
  function setMenu(open){
    if(!menuButton||!menu) return;
    menuButton.classList.toggle('open',open);
    menuButton.setAttribute('aria-expanded',open?'true':'false');
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu.classList.toggle('open',open);
    menu.setAttribute('aria-hidden',open?'false':'true');
    body.classList.toggle('mobile-menu-open',open);
  }
  if(menuButton){menuButton.addEventListener('click',function(){setMenu(!menu.classList.contains('open'));});}
  if(close){close.addEventListener('click',function(){setMenu(false);});}
  if(menu){menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
  window.addEventListener('pageshow',function(){setMenu(false);});
  setMenu(false);

  // Product accordions
  document.querySelectorAll('.acc-item').forEach(function(item){
    var button=item.querySelector('.acc-button');
    var bodyEl=item.querySelector('.acc-body');
    if(!button||!bodyEl)return;
    button.setAttribute('aria-expanded','false');
    button.addEventListener('click',function(){
      var open=!item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(function(other){
        if(other!==item){other.classList.remove('open');var b=other.querySelector('.acc-body');if(b)b.style.maxHeight='0px';var h=other.querySelector('.acc-button');if(h)h.setAttribute('aria-expanded','false');}
      });
      item.classList.toggle('open',open);button.setAttribute('aria-expanded',open?'true':'false');bodyEl.style.maxHeight=open?bodyEl.scrollHeight+'px':'0px';
    });
  });

  // Reveal is CSS-visible from first paint. No JS delay or observer is used.

  document.querySelectorAll('[data-newsletter]').forEach(function(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      var input=form.querySelector('input[type=email]');
      var msg=form.parentElement.querySelector('.newsletter-success');
      var button=form.querySelector('button[type=submit]');
      if(!input||!input.value.trim()||!input.checkValidity()){if(msg)msg.textContent='Enter a valid work email.';return;}
      if(button)button.disabled=true;
      if(msg)msg.textContent='Joining…';
      try{
        var response=await fetch('https://formsubmit.co/ajax/hello@nentric.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:input.value.trim(),form_type:'Nentric newsletter signup',_subject:'New Nentric newsletter signup'})});
        var data=await response.json().catch(function(){return {success:false}});
        if(!response.ok || data.success===false)throw new Error('Newsletter submission failed');
        if(msg)msg.textContent="You're on the list.";
        form.reset();
      }catch(err){
        if(msg)msg.textContent='Could not subscribe right now. Please try again.';
      }finally{if(button)button.disabled=false;}
    });
  });
})();

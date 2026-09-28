(function(){
  'use strict';

  var body=document.body;
  var themeToggle=document.getElementById('themeToggle');
  var brandWordmark=document.querySelector('[data-brand-wordmark]');

  function syncTheme(){
    document.documentElement.classList.remove('nentric-dark-preload');
    var dark=body.classList.contains('dark-theme');
    if(themeToggle){
      themeToggle.setAttribute('aria-pressed',dark?'true':'false');
      themeToggle.setAttribute('aria-label',dark?'Switch to bright theme':'Switch to dark theme');
    }
    if(brandWordmark){
      var src=dark?brandWordmark.getAttribute('data-dark'):brandWordmark.getAttribute('data-light');
      if(src) brandWordmark.src=src;
    }
    var favicon=document.getElementById('themeFavicon'); if(favicon) favicon.href='assets/favicon-orange.png';
  }

  try{ if(localStorage.getItem('nentric-theme')==='dark') body.classList.add('dark-theme'); }catch(e){}
  syncTheme();
  if(themeToggle){
    themeToggle.addEventListener('click',function(){
      var dark=body.classList.toggle('dark-theme');
      try{localStorage.setItem('nentric-theme',dark?'dark':'light');}catch(e){}
      syncTheme();
    });
  }

  /* One homepage mobile-menu owner. This removes the previous double-toggle race. */
  var menu=document.getElementById('mobileMenu');
  var menuButton=document.getElementById('mobileMenuToggle');
  var menuClose=document.getElementById('mobileMenuClose');
  function setMenu(open){
    if(!menu||!menuButton)return;
    open=!!open;
    menu.classList.toggle('open',open);
    menuButton.classList.toggle('open',open);
    menuButton.setAttribute('aria-expanded',open?'true':'false');
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu.setAttribute('aria-hidden',open?'false':'true');
    body.classList.toggle('mobile-menu-open',open);
  }
  function resetMenu(){setMenu(false);}
  if(menuButton){menuButton.addEventListener('click',function(){setMenu(!menu.classList.contains('open'));});}
  if(menuClose){menuClose.addEventListener('click',resetMenu);}
  if(menu){menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',resetMenu);});}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')resetMenu();});
  window.addEventListener('pageshow',resetMenu);
  setMenu(false);

  var productData={
    flow:{
      eyebrow:'Nentric Flow',
      title:'Access that moves.',
      copy:'A modern access layer for estates, offices and communities. Flow brings invitations, identity checks, host notifications and entry status into one clear event, so residents, visitors and security teams can see who is arriving, what has been approved and what happens next.',
      scene:['Guest arrival','Host notified','Access verified'],
      image:'assets/home-local/img-750aca58c5.webp',
      alt:'Nentric Flow access environment',
      cls:''
    },
    stay:{
      eyebrow:'Nentric Stay',
      title:'Home, connected.',
      copy:'A calmer residential layer that brings household access, guests, services and everyday requests together. Stay gives residents a simpler place to manage the moments around home while keeping shared spaces and the people who use them connected.',
      scene:['My home','Household','Guest access'],
      image:'assets/home-local/img-98e7a806a8.webp',
      alt:'Nentric Stay app experience',
      cls:'stay'
    },
    command:{
      eyebrow:'Nentric Command',
      title:'For institutions in motion.',
      copy:'An operational layer for institutions where identity, authority, access and movement need to stay aligned. Command makes responsibility and proof easier to follow across complex environments without forcing teams to replace every system they already run.',
      scene:['Who has authority','What is changing','What happens next'],
      image:'assets/home-local/img-281bcea047.webp',
      alt:'Nentric Command institutional security environment',
      cls:'command'
    }
  };

  var tabs=Array.prototype.slice.call(document.querySelectorAll('.explorer-tab'));
  var view=document.getElementById('explorerView');
  var eyebrow=document.getElementById('explorerEyebrow');
  var title=document.getElementById('explorerTitle');
  var copy=document.getElementById('explorerCopy');
  var scene=document.getElementById('sceneStack');
  var image=document.getElementById('explorerImage');

  function renderProduct(key){
    var data=productData[key];
    if(!data||!view||!eyebrow||!title||!copy||!scene)return;
    eyebrow.textContent=data.eyebrow;
    title.textContent=data.title;
    copy.textContent=data.copy;
    if(image){image.src=data.image;image.alt=data.alt;image.style.opacity='1';}
    view.classList.remove('command','stay');
    if(data.cls)view.classList.add(data.cls);
    scene.innerHTML=data.scene.map(function(label){return '<div class="scene-card"><span>'+label+'</span><span class="scene-pill"></span></div>';}).join('');
    tabs.forEach(function(tab){
      var active=tab.getAttribute('data-tab')===key;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-selected',active?'true':'false');
    });
  }
  tabs.forEach(function(tab){tab.addEventListener('click',function(){renderProduct(tab.getAttribute('data-tab'));});});
  var glow=document.getElementById('cursorGlow');
  if(glow&&window.matchMedia&&!window.matchMedia('(pointer:coarse)').matches){
    var raf=0,lastX=0,lastY=0;
    window.addEventListener('pointermove',function(e){
      lastX=e.clientX;lastY=e.clientY;
      if(raf)return;
      raf=requestAnimationFrame(function(){glow.style.left=lastX+'px';glow.style.top=lastY+'px';raf=0;});
    },{passive:true});
  }


  /* Testimonial slider */
  (function(){
    var slider=document.querySelector('[data-testimonial-slider]');
    if(!slider)return;
    var slides=Array.prototype.slice.call(slider.querySelectorAll('.testimonial-slide'));
    var dotsWrap=slider.querySelector('.testimonial-dots');
    var prev=slider.querySelector('[data-testimonial-prev]');
    var next=slider.querySelector('[data-testimonial-next]');
    var index=0,timer=null,startX=0,startY=0,dragging=false,reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slides.forEach(function(_,i){
      var b=document.createElement('button'); b.type='button'; b.className='testimonial-dot'+(i===0?' active':''); b.setAttribute('role','tab'); b.setAttribute('aria-label','Show testimonial '+(i+1));
      b.setAttribute('aria-selected',i===0?'true':'false'); b.addEventListener('click',function(){show(i,true)}); dotsWrap.appendChild(b);
    });
    var dots=Array.prototype.slice.call(dotsWrap.children);
    function show(i,manual){
      index=(i+slides.length)%slides.length;
      slides.forEach(function(el,n){el.classList.toggle('active',n===index);});
      dots.forEach(function(el,n){el.classList.toggle('active',n===index);el.setAttribute('aria-selected',n===index?'true':'false');});
      if(manual)restart();
    }
    function restart(){if(timer)clearInterval(timer);if(!reduceMotion)timer=setInterval(function(){show(index+1,false)},7000)}
    if(prev)prev.addEventListener('click',function(){show(index-1,true)});
    if(next)next.addEventListener('click',function(){show(index+1,true)});
    slider.addEventListener('mouseenter',function(){if(timer)clearInterval(timer)});
    slider.addEventListener('mouseleave',restart);
    slider.addEventListener('touchstart',function(e){var t=e.changedTouches[0];startX=t.clientX;startY=t.clientY;dragging=true;if(timer)clearInterval(timer)},{passive:true});
    slider.addEventListener('touchend',function(e){if(!dragging)return;dragging=false;var t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){show(index+(dx<0?1:-1),true)}else restart()},{passive:true});
    slider.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(index-1,true);if(e.key==='ArrowRight')show(index+1,true)});
    show(0,false);
    restart();
  })();

  /* V39 FAQ accordion */
  (function(){
    var items=Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
    items.forEach(function(item){
      var btn=item.querySelector('.faq-button');
      if(!btn)return;
      btn.addEventListener('click',function(){
        var open=item.classList.contains('open');
        items.forEach(function(other){other.classList.remove('open');var b=other.querySelector('.faq-button');if(b)b.setAttribute('aria-expanded','false');});
        if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
      });
    });
  })();

  function postForm(form,button,success,bodyData,successText,errorText){
    return fetch('https://formsubmit.co/ajax/hello@nentric.com',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(bodyData)
    }).then(function(response){
      return response.json().catch(function(){return {success:false};}).then(function(data){
        if(!response.ok||data.success===false)throw new Error('Submission failed');
        success.textContent=successText;
        form.reset();
      });
    }).catch(function(){success.textContent=errorText;}).finally(function(){if(button)button.disabled=false;});
  }

  var form=document.getElementById('contactForm');
  var success=document.getElementById('successMessage');
  if(form&&success){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var nameField=form.elements.namedItem('name'),emailField=form.elements.namedItem('email'),companyField=form.elements.namedItem('company'),messageField=form.elements.namedItem('message');
      var name=nameField?nameField.value.trim():'',email=emailField?emailField.value.trim():'',company=companyField?companyField.value.trim():'',message=messageField?messageField.value.trim():'';
      if(!name||!email||!message||!email.includes('@')){
        success.style.display='block';success.textContent='Please add your name, a valid email and a message.';success.style.color='#9a2e00';return;
      }
      var button=form.querySelector('button[type="submit"]');
      if(button)button.disabled=true;
      success.style.display='block';success.style.color='#7c3500';success.textContent='Sending your enquiry…';
      postForm(form,button,success,{name:name,email:email,company:company,message:message,_replyto:email,form_type:'Nentric homepage enquiry',_subject:'New Nentric enquiry from '+name},'Thanks. Your enquiry has been sent to Nentric.','We could not send that right now. Please try again.');
    });
  }

  var newsletterForm=document.getElementById('newsletterForm');
  var newsletterSuccess=document.getElementById('newsletterSuccess');
  if(newsletterForm&&newsletterSuccess){
    newsletterForm.addEventListener('submit',function(e){
      e.preventDefault();
      var input=newsletterForm.newsletterEmail,button=newsletterForm.querySelector('button[type="submit"]'),email=input?input.value.trim():'';
      if(!email||!email.includes('@')){newsletterSuccess.textContent='Please enter a valid email.';return;}
      if(button)button.disabled=true;newsletterSuccess.textContent='Joining…';
      postForm(newsletterForm,button,newsletterSuccess,{email:email,form_type:'Nentric newsletter signup',_subject:'New Nentric newsletter signup'},'You are on the list.','Could not subscribe right now. Please try again.');
    });
  }
})();

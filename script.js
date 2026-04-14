let currentLang=localStorage.getItem('lang')||'en';
let isDark=localStorage.getItem('theme')==='dark';
function injectCommonElements(){
  const headerHTML=`
    <nav>
      <div class="logo"><i class="fas fa-compass"></i> Helper Guide</div>
      <div class="nav-links">
        <a href="index.html"><i class="fas fa-home"></i> Home</a>
        <div class="dropdown" id="servicesDropdown">
          <a href="#" class="dropbtn" id="dropdownToggle">Services <i class="fas fa-chevron-down"></i></a>
          <div class="dropdown-content" id="dropdownMenu">
            <a href="aadhaar-guide.html"><i class="fas fa-id-card"></i> Aadhaar Update</a>
            <a href="pan-guide.html"><i class="fas fa-credit-card"></i> PAN Card</a>
            <a href="driving-licence.html"><i class="fas fa-car"></i> Driving Licence</a>
            <a href="passport.html"><i class="fas fa-passport"></i> Passport</a>
            <a href="status-check.html"><i class="fas fa-search"></i> Track Status</a>
          </div>
        </div>
        <a href="blog.html"><i class="fas fa-blog"></i> Blog</a>
        <a href="about.html"><i class="fas fa-info-circle"></i> About</a>
        <a href="contact.html"><i class="fas fa-envelope"></i> Contact</a>
      </div>
      <div class="nav-controls">
        <div class="search-wrapper">
          <input type="text" id="globalSearchInput" placeholder="Search..." aria-label="Search">
          <button id="globalSearchBtn"><i class="fas fa-search"></i></button>
        </div>
        <button class="lang-toggle" id="langToggle">हिंदी</button>
        <button class="dark-toggle" id="darkToggle"><i class="fas fa-moon"></i></button>
      </div>
    </nav>
  `;
  const footerHTML=`
    <div class="footer">
      <p>© 2026 Helper Guide · Created & Maintained by <strong>Kunal Singh Foujdar</strong></p>
      <p><a href="privacy-policy.html">Privacy Policy</a> | <a href="terms.html">Terms & Conditions</a> | <a href="contact.html">Contact</a></p>
    </div>
  `;
  const container=document.querySelector('.container');
  if(container){
    container.insertAdjacentHTML('afterbegin',headerHTML);
    container.insertAdjacentHTML('beforeend',footerHTML);
  }
  initDropdown();initDarkMode();initLanguageToggle();initGlobalSearch();
}
function initDropdown(){
  const toggle=document.getElementById('dropdownToggle');
  const menu=document.getElementById('dropdownMenu');
  if(!toggle||!menu)return;
  toggle.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();menu.classList.toggle('show')});
  document.addEventListener('click',(e)=>{if(!toggle.contains(e.target)&&!menu.contains(e.target))menu.classList.remove('show')});
}
function initDarkMode(){
  const body=document.body;
  const dt=document.getElementById('darkToggle');
  if(!dt)return;
  if(isDark){body.classList.add('dark');dt.innerHTML='<i class="fas fa-sun"></i>';}
  dt.addEventListener('click',()=>{
    body.classList.toggle('dark');
    const isNowDark=body.classList.contains('dark');
    dt.innerHTML=isNowDark?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';
    localStorage.setItem('theme',isNowDark?'dark':'light');
  });
}
function initLanguageToggle(){
  const lt=document.getElementById('langToggle');
  if(!lt)return;
  function setLang(lang){
    document.querySelectorAll('[data-en][data-hi]').forEach(el=>{el.textContent=el.getAttribute(`data-${lang}`)});
    lt.textContent=lang==='en'?'हिंदी':'English';
    currentLang=lang;
    localStorage.setItem('lang',lang);
  }
  lt.addEventListener('click',()=>setLang(currentLang==='en'?'hi':'en'));
  setLang(currentLang);
}
function initGlobalSearch(){
  const input=document.getElementById('globalSearchInput');
  const btn=document.getElementById('globalSearchBtn');
  if(!input||!btn)return;
  const performSearch=()=>{
    const query=input.value.trim();
    if(query)window.location.href=`index.html?search=${encodeURIComponent(query)}`;
  };
  btn.addEventListener('click',performSearch);
  input.addEventListener('keypress',(e)=>{if(e.key==='Enter')performSearch()});
}
function handleShare(title,url){
  if(navigator.share)navigator.share({title,url:url||window.location.href});
  else alert(`Share: ${url||window.location.href}`);
}
function handlePrint(){window.print()}
function handlePDF(contentSelector,filename='guide.pdf'){
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const element=document.querySelector(contentSelector);
  if(element){doc.text(element.innerText,15,20,{maxWidth:180});doc.save(filename);}
}
function handleVoice(contentSelector){
  if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();return;}
  const element=document.querySelector(contentSelector);
  if(element){
    const utterance=new SpeechSynthesisUtterance(element.innerText);
    window.speechSynthesis.speak(utterance);
  }
}
function initStickyStartButton(serviceName){
  const btn=document.createElement('button');
  btn.className='sticky-start-btn show';
  btn.innerHTML=`<i class="fas fa-play"></i> <span data-en="Start ${serviceName} Application" data-hi="${serviceName} आवेदन शुरू करें">Start ${serviceName} Application</span>`;
  document.body.appendChild(btn);
  btn.addEventListener('click',()=>showStepsModal(serviceName));
}
function showStepsModal(serviceName){
  const modal=document.createElement('div');
  modal.className='modal';
  modal.style.display='flex';
  const steps=getServiceSteps(serviceName);
  modal.innerHTML=`
    <div class="modal-content">
      <h3 data-en="Before you proceed" data-hi="आगे बढ़ने से पहले">Before you proceed</h3>
      <div class="guide-step">${steps.map((s,i)=>`<div class="step-item">${i+1}. ${s}</div>`).join('')}</div>
      <p data-en="You will be redirected to the official website." data-hi="आपको आधिकारिक वेबसाइट पर रीडायरेक्ट किया जाएगा।">You will be redirected to the official website.</p>
      <div style="display:flex;gap:12px;margin-top:20px;">
        <button class="btn" id="proceedBtn"><span data-en="Proceed to Official Site" data-hi="आधिकारिक साइट पर जाएं">Proceed to Official Site</span></button>
        <button class="btn btn-outline" id="cancelModalBtn"><span data-en="Cancel" data-hi="रद्द करें">Cancel</span></button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cancelModalBtn').addEventListener('click',()=>modal.remove());
  document.getElementById('proceedBtn').addEventListener('click',()=>{
    const urls={
      Aadhaar:'https://myaadhaar.uidai.gov.in/',
      PAN:'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      'Driving Licence':'https://parivahan.gov.in/parivahan/',
      Passport:'https://www.passportindia.gov.in/AppOnlineProject/welcomeLink'
    };
    window.open(urls[serviceName],'_blank');
    modal.remove();
  });
}
function getServiceSteps(serviceName){
  const steps={
    Aadhaar:['Have your Aadhaar number ready','Ensure mobile number is linked for OTP','Keep scanned documents (PDF/JPEG)','Payment method for ₹50 fee'],
    PAN:['Have Aadhaar for e-KYC','Scanned photo and signature','Payment method for ₹107 fee'],
    'Driving Licence':['Age proof document','Address proof','Passport size photo','Form 1 (medical) if applicable'],
    Passport:['Identity and address proof','Date of birth proof','Passport size photos','Payment method for fee']
  };
  return steps[serviceName]||['Prepare necessary documents','Visit official website','Fill application form','Pay fee','Submit'];
}
function initProgressTracker(stepsCount,storageKey){
  const progressBar=document.querySelector('.progress-bar');
  const checkboxes=document.querySelectorAll('.step-checkbox');
  if(!progressBar||checkboxes.length===0)return;
  const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
  checkboxes.forEach((cb,idx)=>{
    cb.checked=saved[idx]||false;
    cb.addEventListener('change',()=>{
      const states=Array.from(checkboxes).map(c=>c.checked);
      localStorage.setItem(storageKey,JSON.stringify(states));
      const completed=states.filter(Boolean).length;
      progressBar.style.width=`${(completed/stepsCount)*100}%`;
    });
  });
  const completed=Array.from(checkboxes).filter(c=>c.checked).length;
  progressBar.style.width=`${(completed/stepsCount)*100}%`;
}
function initChecklistGenerator(docListId,storageKey){
  const container=document.getElementById(docListId);
  if(!container)return;
  const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
  container.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    const key=cb.nextSibling?.textContent||'';
    cb.checked=saved[key]||false;
    cb.addEventListener('change',()=>{
      const state={};
      container.querySelectorAll('input[type="checkbox"]').forEach(c=>{state[c.nextSibling?.textContent||'']=c.checked});
      localStorage.setItem(storageKey,JSON.stringify(state));
    });
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  injectCommonElements();
  setTimeout(()=>{
    const printBtn=document.getElementById('printGuideBtn');
    const pdfBtn=document.getElementById('pdfDownloadBtn');
    const voiceBtn=document.getElementById('voiceGuideBtn');
    const shareBtn=document.getElementById('shareGuideBtn')||document.getElementById('sharePageBtn');
    if(printBtn)printBtn.addEventListener('click',handlePrint);
    if(pdfBtn)pdfBtn.addEventListener('click',()=>handlePDF('.guide-step','Guide.pdf'));
    if(voiceBtn)voiceBtn.addEventListener('click',()=>handleVoice('.guide-step'));
    if(shareBtn)shareBtn.addEventListener('click',()=>handleShare('Helper Guide',window.location.href));
    const serviceName=document.body.getAttribute('data-service');
    if(serviceName)initStickyStartButton(serviceName);
    if(document.querySelector('.progress-bar')){
      const stepsCount=parseInt(document.body.getAttribute('data-steps')||'0');
      const storageKey=document.body.getAttribute('data-storage-key')||'progress';
      initProgressTracker(stepsCount,storageKey);
    }
    if(document.getElementById('docChecklist')){
      const storageKey=document.body.getAttribute('data-checklist-key')||'checklist';
      initChecklistGenerator('docChecklist',storageKey);
    }
  },50);
});

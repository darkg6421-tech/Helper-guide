document.addEventListener('DOMContentLoaded',()=>{
  const urlParams=new URLSearchParams(window.location.search);
  const searchQuery=urlParams.get('search');
  const filterInput=document.getElementById('serviceFilterInput');
  const serviceCards=document.querySelectorAll('.service-card');
  if(filterInput){
    filterInput.addEventListener('input',(e)=>{
      const term=e.target.value.toLowerCase();
      serviceCards.forEach(card=>{
        const title=card.querySelector('h3')?.innerText.toLowerCase()||'';
        const desc=card.querySelector('p')?.innerText.toLowerCase()||'';
        card.style.display=(title.includes(term)||desc.includes(term))?'':'none';
      });
    });
    if(searchQuery){filterInput.value=searchQuery;filterInput.dispatchEvent(new Event('input'));}
  }else if(searchQuery){
    const term=searchQuery.toLowerCase();
    serviceCards.forEach(card=>{
      const title=card.querySelector('h3')?.innerText.toLowerCase()||'';
      card.style.display=title.includes(term)?'':'none';
    });
  }
});

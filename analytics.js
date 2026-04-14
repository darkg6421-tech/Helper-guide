(function(){
  const gaId='G-XXXXXXXXXX';
  const script=document.createElement('script');
  script.src=`https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async=true;
  document.head.appendChild(script);
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  gtag('js',new Date());gtag('config',gaId);
  console.log('Analytics placeholder. Replace G-XXXXXXXXXX with real ID.');
})();

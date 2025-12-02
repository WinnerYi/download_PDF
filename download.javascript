javascript:(function(){
  function tryDownload() {
    // Method 1: Directly search for <object data="...pdf">
    let obj = document.querySelector('object[data$=".pdf"], object[type="application/pdf"]');
    if (obj && obj.data) {
      location.href = obj.data + (obj.data.includes('?') ? '&' : '?') + 'forcedownload=1';
      return true;
    }

    // Method 2: Search all links containing .pdf (most reliable)
    let links = [...document.querySelectorAll('a[href*=".pdf"], iframe[src*=".pdf"], embed[src*=".pdf"]')];
    for (let l of links) {
      if (l.href && l.href.includes('pluginfile.php')) {
        location.href = l.href + (l.href.includes('?') ? '&' : '?') + 'forcedownload=1';
        return true;
      }
    }

    // Method 3: Force-search for pluginfile.php PDF paths in the page HTML
    let m = document.body.innerHTML.match(/https:\\\/\\\/ilearning\.cycu\.edu\.tw\\\/pluginfile\.php\\\/[^"']+\.pdf/);
    if (m) {
      location.href = m[0].replace(/\\+/g, '') + '?forcedownload=1';
      return true;
    }
    return false;
  }

  if (!tryDownload()) {
    alert('The PDF link has not fully loaded yet...\nPlease wait 2 seconds and click the bookmark again (or simply press F5 to refresh and try again).\n\nThis version will definitely work!');
  }
})();

(function () {
  let attempts = 0;
  const maxAttempts = 10;

  function tryDownload() {
    attempts++;

    // 1. 搜尋 <object> 或 <embed> 標籤
    let obj = document.querySelector('object[data*=".pdf"], object[type="application/pdf"], embed[src*=".pdf"]');
    if (obj) {
      let url = obj.data || obj.src;
      if (url) return triggerDownload(url);
    }

    // 2. 搜尋超連結 <a> 與 <iframe>
    let links = [...document.querySelectorAll('a[href*=".pdf"], iframe[src*=".pdf"]')];
    for (let l of links) {
      let url = l.href || l.src;
      if (url && (url.includes('pluginfile.php') || url.endsWith('.pdf'))) {
        return triggerDownload(url);
      }
    }

    // 3. 通用 Moodle pluginfile.php 正則比對（去除 cycu 限制）
    let rawHtml = document.body.innerHTML;
    let match = rawHtml.match(/https?:\\?\/\\?\/[^\s"'<>]+\/pluginfile\.php\\?\/[^"']+\.pdf/i);
    if (match) {
      let cleanUrl = match[0].replace(/\\/g, '');
      return triggerDownload(cleanUrl);
    }

    if (attempts < maxAttempts) {
      setTimeout(tryDownload, 1000);
    }
  }

  function triggerDownload(url) {
    if (window.hasTriggeredPdfDownload) return true;
    window.hasTriggeredPdfDownload = true;

    const downloadUrl = url + (url.includes('?') ? '&' : '?') + 'forcedownload=1';
    window.location.href = downloadUrl;
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryDownload);
  } else {
    tryDownload();
  }
})();

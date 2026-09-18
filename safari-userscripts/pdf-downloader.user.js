// ==UserScript==
// @name         Universal Moodle & PDF Downloader (Safari)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  僅在偵測到 PDF 或 Moodle 頁面時動態顯示下載按鈕
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  
  function hasPdfContent() {
    const host = window.location.hostname;
    if (host.includes('github.com') || host.includes('google.com') || host.includes('stackoverflow.com')) {
      return false;
    }

 
    const hasObject = !!document.querySelector('object[data*=".pdf"], object[type="application/pdf"], embed[src*=".pdf"]');
    if (hasObject) return true;

    
    const hasPdfLink = [...document.querySelectorAll('a[href*=".pdf"], iframe[src*=".pdf"]')].some(
      l => (l.href || l.src) && ((l.href || l.src).includes('pluginfile.php') || (l.href || l.src).endsWith('.pdf'))
    );
    if (hasPdfLink) return true;

    
    if (window.location.href.includes('/mod/pdfannotator/view.php')) return true;
    
    const rawHtml = document.body.innerHTML;
    return /pluginfile\.php\\?\/[^"']+\.pdf/i.test(rawHtml);
  }

 
  function createDownloadButton() {
    if (document.getElementById('safari-pdf-download-btn')) return;
    if (!hasPdfContent()) return;

    const btn = document.createElement('button');
    btn.id = 'safari-pdf-download-btn';
  
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>Download PDF</span>
    `;

    // 淺藍綠質感樣式
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '24px',
      right: '80px',
      zIndex: '999999',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '9px 18px',
      
      
      backgroundColor: 'rgba(224, 247, 244, 0.55)',
      backdropFilter: 'blur(16px) saturate(180%)',
      webkitBackdropFilter: 'blur(16px) saturate(180%)',
      
      color: '#0d5c53', 
      border: '1px solid rgba(255, 255, 255, 0.8)', 
      borderRadius: '30px',
      boxShadow: '0 8px 32px 0 rgba(13, 92, 83, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
      
      fontSize: '13px',
      fontWeight: '600',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      cursor: 'pointer',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      userSelect: 'none'
    });

    
    btn.onmouseenter = () => {
      btn.style.transform = 'translateY(-3px) scale(1.02)';
      btn.style.backgroundColor = 'rgba(204, 242, 237, 0.75)';
      btn.style.borderColor = 'rgba(255, 255, 255, 0.95)';
      btn.style.boxShadow = '0 12px 40px 0 rgba(13, 92, 83, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.7)';
    };

    btn.onmouseleave = () => {
      btn.style.transform = 'translateY(0) scale(1)';
      btn.style.backgroundColor = 'rgba(224, 247, 244, 0.55)';
      btn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      btn.style.boxShadow = '0 8px 32px 0 rgba(13, 92, 83, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.5)';
    };

    btn.onmousedown = () => {
      btn.style.transform = 'translateY(-1px) scale(0.97)';
    };

    btn.onclick = triggerDownloadProcess;
    document.body.appendChild(btn);
  }
  function triggerDownloadProcess() {
    let obj = document.querySelector('object[data*=".pdf"], object[type="application/pdf"], embed[src*=".pdf"]');
    if (obj) {
      let url = obj.data || obj.src;
      if (url) return startDownload(url);
    }

    let links = [...document.querySelectorAll('a[href*=".pdf"], iframe[src*=".pdf"]')];
    for (let l of links) {
      let url = l.href || l.src;
      if (url && (url.includes('pluginfile.php') || url.endsWith('.pdf'))) {
        return startDownload(url);
      }
    }

    let rawHtml = document.body.innerHTML;
    let match = rawHtml.match(/https?:\\?\/\\?\/[^\s"'<>]+\/pluginfile\.php\\?\/[^"']+\.pdf/i);
    if (match) {
      let cleanUrl = match[0].replace(/\\/g, '');
      return startDownload(cleanUrl);
    }

    if (window.location.href.includes('/mod/pdfannotator/view.php')) {
      return startDownload(window.location.href);
    }

    alert('PDF NOT FOUND！');

    function startDownload(url) {
      const separator = url.includes('?') ? '&' : '?';
      let downloadUrl = url;
      if (url.includes('/mod/pdfannotator/view.php')) {
        downloadUrl = url + separator + 'action=download&forcedownload=1';
      } else {
        downloadUrl = url + separator + 'forcedownload=1';
      }
      window.location.href = downloadUrl;
    }
  }

 
  function init() {
    createDownloadButton();
    setTimeout(createDownloadButton, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

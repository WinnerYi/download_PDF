chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: triggerDownloadProcess
  });
});

function triggerDownloadProcess() {
  // 1. 搜尋 <object> 或 <embed> 標籤
  let obj = document.querySelector('object[data*=".pdf"], object[type="application/pdf"], embed[src*=".pdf"]');
  if (obj) {
    let url = obj.data || obj.src;
    if (url) return startDownload(url);
  }

  // 2. 搜尋超連結 <a> 與 <iframe>
  let links = [...document.querySelectorAll('a[href*=".pdf"], iframe[src*=".pdf"]')];
  for (let l of links) {
    let url = l.href || l.src;
    if (url && (url.includes('pluginfile.php') || url.endsWith('.pdf'))) {
      return startDownload(url);
    }
  }

  // 3. 通用 Moodle pluginfile.php 正則比對
  let rawHtml = document.body.innerHTML;
  let match = rawHtml.match(/https?:\\?\/\\?\/[^\s"'<>]+\/pluginfile\.php\\?\/[^"']+\.pdf/i);
  if (match) {
    let cleanUrl = match[0].replace(/\\/g, '');
    return startDownload(cleanUrl);
  }

  alert('此頁面未偵測到可下載的內嵌 PDF！');

  function startDownload(url) {
    const downloadUrl = url + (url.includes('?') ? '&' : '?') + 'forcedownload=1';
    window.location.href = downloadUrl;
  }
}
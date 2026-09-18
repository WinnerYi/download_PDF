# Moodle / iLearning PDF 下載器 

寫這個工具是因為每次要在學校 Moodle 或 iLearning 上下載講義，檔案都被嵌入在頁面裡面不能直接存，要一直點選或另存新檔很麻煩。

這個專案包含 **Chrome 擴充套件** 與 **Safari Userscript** 兩種版本，核心邏輯一樣，會自動抓取頁面裡的內嵌 PDF 網址並幫你下載。

---

## 支援版本與功能

* **Safari 版**：進入含有 PDF 的課程頁面時，右下角會出現一個淺藍綠色毛玻璃質感的「下載文件」懸浮按鈕，點了才會下載（不會亂開新分頁）。
* **Chrome / Edge 版**：點右上角工具列的擴充套件圖示，就會掃描當前頁面並觸發下載。

---

## 專案結構

```text
.
├── README.md
├── chrome/
│   ├── manifest.json
│   └── background.js
└── safari/
    └── pdf-downloader.user.js

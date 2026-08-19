# 🧩 Doclly Browser Extension (Chrome, Edge, Brave, Firefox)

A lightweight, instant-launch browser extension (Manifest V3) for the Doclly PDF & Document Suite.

---

## 🚀 How to Install & Test in Chrome / Edge (Developer Mode)

You can load and use the extension on your browser in **less than 1 minute**:

### 1️⃣ Open Chrome Extensions:
* Open Google Chrome or Microsoft Edge or Brave.
* In the address bar, type:
  ```text
  chrome://extensions/
  ```
  *(For Edge: `edge://extensions/`)*

### 2️⃣ Turn on Developer Mode:
* Toggle the **"Developer mode"** switch in the top-right corner to **ON**.

### 3️⃣ Load the Extension:
* Click the **"Load unpacked"** button (top-left).
* Select the folder:
  ```text
  c:\Users\User\Downloads\allinonetool\doclly-extension
  ```
* Click **Select Folder**.

🎉 **That's it!** The Doclly extension icon will now appear in your browser toolbar!

---

## ✨ Extension Features Included:
1. **Instant Tool Launcher (380x540px Popup)**:
   * **Live Search**: Instant typing filter across all 25+ PDF tools.
   * **Category Tabs**: *All*, *Edit & Sign*, *Convert*, *Compress*, *Organize*.
   * **3D Icons**: Offline high-definition 3D icons for instant recognition.
   * **🎓 ₹19 Student Pass Shortcut**: Direct 1-click access to `https://student.doclly.online`.
2. **Quick File Dropzone**: Drag & drop any PDF directly into the extension popup to start working immediately.
3. **Right-Click Context Menu**: Right-click on any webpage or link $\rightarrow$ quick shortcuts to *Edit Scanned PDF*, *Compress PDF*, or *PDF to Word*.

---

## 📦 How to Package for the Chrome Web Store:

When you are ready to publish to the **[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)**:

1. Open terminal and run:
   ```bash
   node package-extension.mjs
   ```
2. Upload the generated `doclly-extension.zip` file to the Chrome Web Store Dashboard!

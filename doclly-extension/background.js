// Doclly Extension Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menus
  chrome.contextMenus.create({
    id: 'doclly-root',
    title: 'Doclly PDF Tools',
    contexts: ['page', 'link', 'selection']
  });

  chrome.contextMenus.create({
    parentId: 'doclly-root',
    id: 'doclly-home',
    title: 'Open Doclly Home',
    contexts: ['page', 'link', 'selection']
  });

  chrome.contextMenus.create({
    parentId: 'doclly-root',
    id: 'doclly-edit',
    title: '✍️ Edit Scanned PDF',
    contexts: ['page', 'link']
  });

  chrome.contextMenus.create({
    parentId: 'doclly-root',
    id: 'doclly-compress',
    title: '📉 Compress PDF (<200 KB)',
    contexts: ['page', 'link']
  });

  chrome.contextMenus.create({
    parentId: 'doclly-root',
    id: 'doclly-word',
    title: '🔄 PDF to Word',
    contexts: ['page', 'link']
  });

  chrome.contextMenus.create({
    parentId: 'doclly-root',
    id: 'doclly-student',
    title: '🎓 Student Offer (₹19/yr)',
    contexts: ['page', 'link', 'selection']
  });
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let targetUrl = 'https://www.doclly.online';

  switch (info.menuItemId) {
    case 'doclly-edit':
      targetUrl = 'https://www.doclly.online/tools/edit-pdf';
      break;
    case 'doclly-compress':
      targetUrl = 'https://www.doclly.online/tools/compress-pdf';
      break;
    case 'doclly-word':
      targetUrl = 'https://www.doclly.online/tools/pdf-to-word';
      break;
    case 'doclly-student':
      targetUrl = 'https://student.doclly.online';
      break;
    default:
      targetUrl = 'https://www.doclly.online';
  }

  chrome.tabs.create({ url: targetUrl });
});

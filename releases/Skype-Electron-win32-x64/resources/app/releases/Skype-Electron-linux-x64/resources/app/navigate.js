var webview = document.getElementById('webview');
webview.addEventListener('new-window', function(e) {
  e.preventDefault();
  require('shell').openExternal(e.url);
});

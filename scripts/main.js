
window.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', storedTheme);

    if (darkModeToggle) {
        darkModeToggle.checked = storedTheme === 'dark';
        darkModeToggle.addEventListener('change', function() {
            const newTheme = darkModeToggle.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

// Enhanced Safari detection
function isSafariBrowser() {
    // Check for Safari desktop and iOS
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);

    // Additional check for Safari on iOS 13+
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAppleWebKit = /AppleWebKit/.test(navigator.userAgent);

    return isSafari || (isIOS && isAppleWebKit && !window.MSStream);
}

// Show warning if Safari
if (isSafariBrowser()) {
    // Check if warning was previously dismissed
    if (!localStorage.getItem('safariWarningDismissed')) {
        const warningHTML = `
          <div class="safari-warning alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">
            <div class="container">
              <strong><i class="bi bi-exclamation-triangle-fill"></i> Browser Compatibility Notice:</strong> 
              You're using Safari which may not support all features of this website. 
              For best experience, we recommend using <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>, 
              <a href="https://www.mozilla.org/firefox/" target="_blank">Firefox</a>, or 
              <a href="https://www.microsoft.com/edge" target="_blank">Edge</a>.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" id="dismissSafariWarning"></button>
            </div>
          </div>
        `;

        const warning = document.createElement('div');
        warning.innerHTML = warningHTML;
        document.body.prepend(warning);

    }
}
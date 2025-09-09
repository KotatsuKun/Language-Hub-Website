//dark mode toggle
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

//Safari detection
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

//Acessibility

document.addEventListener('DOMContentLoaded', function(){
  const acessibilityBtn = document.getElementById('acessibility-btn');
  const acessibilityOpt = document.getElementById('acessibility-opt');
  const biggerFontBtn =  document.getElementById('BiggerFont');
  const smallerFontBtn =  document.getElementById('SmallerFont');

  const highConstrast = document.getElementById('high-contrast');

 

  let FontSize = 1


  acessibilityBtn.addEventListener('click', function(){
    acessibilityBtn.classList.toggle('lateral-btn');
    acessibilityOpt.classList.toggle('show-list');

    const selectedButton = acessibilityBtn.getAttribute('aria-expanded') === 'true';
    acessibilityBtn.setAttribute('aria-expanded', !selectedButton)

  });

  biggerFontBtn.addEventListener('click', function(){
    FontSize += 0.1 ;
    document.body.style.fontSize =  `${FontSize}rem`
  });
  
  smallerFontBtn.addEventListener('click', function(){
    FontSize -= 0.1 ;
    document.body.style.fontSize =  `${FontSize}rem`
  });

  highConstrast.addEventListener('click', function(){
    document.body.classList.toggle('high-contrast');
  });
})


// Keyboard shortcuts
function createKeyComboListener(combinations) {
    let pressedKeys = new Set();
    
    function handleKeyDown(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return; // Don't trigger in input fields
        }
        
        pressedKeys.add(event.key.toLowerCase());
        
        if (event.ctrlKey) pressedKeys.add('control');
        if (event.shiftKey) pressedKeys.add('shift');
        if (event.altKey) pressedKeys.add('alt');
        
        const currentCombo = Array.from(pressedKeys).sort().join('+');
        
        if (combinations[currentCombo]) {
            window.location.href = combinations[currentCombo];
            pressedKeys.clear();
            event.preventDefault();
        }
    }
    
    function handleKeyUp(event) {
        pressedKeys.delete(event.key.toLowerCase());
        pressedKeys.delete('control');
        pressedKeys.delete('shift');
        pressedKeys.delete('alt');
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Return cleanup function
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    };
}

// Usage
const cleanup = createKeyComboListener({
    'alt+w': 'pages/WebGL.html', 
});

// Call cleanup() when you want to remove the listeners


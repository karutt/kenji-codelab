export function injectCopyButtons(html) {
    return html.replace(
        /<div class="code-block-container">/g,
        `<div class="code-block-container" style="position: relative;">
      <button
        class="copy-button"
        style="
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 999;
          background: transparent;
          border: none;
          padding: 4px;
          color: #fff;"
        onclick="
          (function(btn){
             const codeEl = btn.parentNode.querySelector('pre code');
             if(!codeEl) return;
             let t = codeEl.innerText.replace(/\\n$/,'');
             navigator.clipboard.writeText(t);
          })(this)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1Z"/>
          <path d="M19 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046
            6.89543 23 8 23H19C20.1046 23 21 22.1046
            21 21V7C21 5.89543 20.1046 5 19 5ZM19 21H8V7H19V21Z"/>
        </svg>
      </button>`
    );
}

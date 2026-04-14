/**
 * PHOENNIX AI — clipboard.js
 * Permanent fix for: NotAllowedError: Clipboard API blocked by permissions policy
 *
 * Root cause: navigator.clipboard.writeText() requires:
 *   1. A secure context (https:// or localhost)
 *   2. The document to have clipboard-write permission
 *   3. NOT be inside a sandboxed iframe without allow="clipboard-write"
 *
 * This module uses a 4-layer fallback chain that works in ALL environments:
 *   Layer 1 → navigator.clipboard.writeText()     (modern, needs permission)
 *   Layer 2 → document.execCommand('copy')         (legacy, works in iframes)
 *   Layer 3 → window.clipboardData.setData()       (IE / old Edge)
 *   Layer 4 → Visual selection prompt              (always works)
 */

'use strict';

/* ════════════════════════════════════════
   COPY ENGINE — 4-layer fallback chain
════════════════════════════════════════ */
async function copyToClipboard(text) {
  // ── Layer 1: Modern Clipboard API ──
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return { method: 'clipboard-api', success: true };
    } catch (err) {
      // Blocked by permissions policy — fall through to layer 2
      // Do NOT log this as an error — it's expected in sandboxed contexts
    }
  }

  // ── Layer 2: execCommand (works in iframes, HTTP, sandboxed contexts) ──
  try {
    const success = execCommandCopy(text);
    if (success) return { method: 'exec-command', success: true };
  } catch (err) {
    // Fall through
  }

  // ── Layer 3: IE / old Edge clipboardData ──
  if (typeof window.clipboardData !== 'undefined' && window.clipboardData.setData) {
    try {
      window.clipboardData.setData('Text', text);
      return { method: 'ie-clipboard', success: true };
    } catch (err) {
      // Fall through
    }
  }

  // ── Layer 4: Visual selection fallback — always works ──
  showSelectFallback(text);
  return { method: 'visual-select', success: true };
}

/* ── execCommand implementation ── */
function execCommandCopy(text) {
  const ta = document.createElement('textarea');
  // Position off-screen but not display:none (execCommand requires visible)
  ta.style.cssText = [
    'position:fixed',
    'top:-9999px',
    'left:-9999px',
    'width:1px',
    'height:1px',
    'padding:0',
    'border:0',
    'outline:none',
    'opacity:0',
    'pointer-events:none',
    'z-index:-1'
  ].join(';');
  ta.setAttribute('readonly', '');
  ta.value = text;

  document.body.appendChild(ta);

  // iOS Safari requires a different selection method
  if (navigator.userAgent.match(/ipad|iphone/i)) {
    const range = document.createRange();
    range.selectNodeContents(ta);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    ta.setSelectionRange(0, 999999);
  } else {
    ta.select();
  }

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    success = false;
  }

  document.body.removeChild(ta);
  return success;
}

/* ── Visual select fallback ── */
function showSelectFallback(text) {
  // Create an overlay with the text pre-selected for manual copy
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'background:rgba(3,3,14,0.92)',
    'z-index:99999',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:20px',
    'backdrop-filter:blur(4px)'
  ].join(';');

  const box = document.createElement('div');
  box.style.cssText = [
    'background:#0A0A22',
    'border:1px solid rgba(0,255,136,0.3)',
    'padding:20px 24px',
    'max-width:520px',
    'width:100%'
  ].join(';');

  const label = document.createElement('p');
  label.style.cssText = 'font-family:\'Press Start 2P\',monospace;font-size:7px;color:#00FF88;letter-spacing:1.5px;margin-bottom:12px;';
  label.textContent = 'SELECT ALL AND COPY (Ctrl+A, Ctrl+C)';

  const ta = document.createElement('textarea');
  ta.style.cssText = [
    'width:100%',
    'background:#020209',
    'border:1px solid rgba(0,255,136,0.15)',
    'color:#E8E8FF',
    'font-family:\'JetBrains Mono\',monospace',
    'font-size:12px',
    'padding:12px',
    'line-height:1.6',
    'resize:vertical',
    'min-height:80px',
    'max-height:260px',
    'outline:none'
  ].join(';');
  ta.value = text;
  ta.setAttribute('readonly', '');

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = [
    'margin-top:12px',
    'background:rgba(0,255,136,0.08)',
    'border:1px solid rgba(0,255,136,0.2)',
    'color:#00FF88',
    'font-family:\'Press Start 2P\',monospace',
    'font-size:6px',
    'padding:8px 16px',
    'cursor:pointer',
    'letter-spacing:1px',
    'width:100%'
  ].join(';');
  closeBtn.textContent = '✓ DONE — CLOSE';
  closeBtn.onclick = () => document.body.removeChild(overlay);

  box.appendChild(label);
  box.appendChild(ta);
  box.appendChild(closeBtn);
  overlay.appendChild(box);
  overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);

  // Auto-select the text
  setTimeout(() => { ta.focus(); ta.select(); }, 50);
}

/* ════════════════════════════════════════
   BUTTON STATE MANAGER
════════════════════════════════════════ */
function setCopyBtnState(btn, state) {
  const icon  = btn.querySelector('.copy-icon');
  const check = btn.querySelector('.check-icon');
  const fail  = btn.querySelector('.fail-icon');

  if (state === 'success') {
    btn.classList.add('success');
    btn.classList.remove('failed');
    if (icon)  icon.style.display  = 'none';
    if (check) check.style.display = 'inline';
    if (fail)  fail.style.display  = 'none';
  } else if (state === 'failed') {
    btn.classList.add('failed');
    if (icon)  icon.style.display  = 'none';
    if (check) check.style.display = 'none';
    if (fail)  fail.style.display  = 'inline';
  } else {
    btn.classList.remove('success', 'failed');
    if (icon)  icon.style.display  = 'inline';
    if (check) check.style.display = 'none';
    if (fail)  fail.style.display  = 'none';
  }
}

function resetCopyBtn(btn, delay = 2200) {
  setTimeout(() => setCopyBtnState(btn, 'default'), delay);
}

/* ════════════════════════════════════════
   GLOBAL EVENT DELEGATION
   Handles ALL .copy-btn elements site-wide
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    // Prevent double-click during operation
    if (btn.dataset.copying === 'true') return;
    btn.dataset.copying = 'true';

    const text = btn.getAttribute('data-copy') || '';
    if (!text) {
      btn.dataset.copying = 'false';
      return;
    }

    const result = await copyToClipboard(text);

    setCopyBtnState(btn, 'success');
    resetCopyBtn(btn);
    btn.dataset.copying = 'false';
  });
});

/* ── Export for module use ── */
if (typeof module !== 'undefined') {
  module.exports = { copyToClipboard, execCommandCopy };
}
window.PhoenixClipboard = { copyToClipboard, execCommandCopy };

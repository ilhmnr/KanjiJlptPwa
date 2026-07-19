// Util kecil untuk membacakan teks Jepang memakai Web Speech API bawaan browser.
// Tidak butuh file audio / server TTS eksternal, sehingga tetap ringan dan bisa
// dipakai offline setelah PWA di-install (selama perangkat punya voice Jepang).
export function speak(text, { rate = 0.85 } = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Browser ini tidak mendukung Web Speech API.');
    return false;
  }
  window.speechSynthesis.cancel(); // hentikan ucapan sebelumnya supaya tidak menumpuk
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
  return true;
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

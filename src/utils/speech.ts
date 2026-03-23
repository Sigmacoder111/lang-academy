export function speakChinese(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error("SpeechSynthesis not supported"));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(
      (v) => v.lang === "zh-CN" || v.lang.startsWith("zh")
    );
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function speakChineseWithVoice(
  text: string,
  preferFemale: boolean,
  rate: number = 0.9
): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const chineseVoices = voices.filter(
      (v) => v.lang === "zh-CN" || v.lang.startsWith("zh")
    );

    if (chineseVoices.length > 1) {
      const target = preferFemale
        ? chineseVoices.find((v) => v.name.toLowerCase().includes("female")) ??
          chineseVoices[0]
        : chineseVoices.find((v) => v.name.toLowerCase().includes("male")) ??
          chineseVoices[chineseVoices.length > 1 ? 1 : 0];
      utterance.voice = target;
    } else if (chineseVoices.length === 1) {
      utterance.voice = chineseVoices[0];
      utterance.pitch = preferFemale ? 1.2 : 0.8;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

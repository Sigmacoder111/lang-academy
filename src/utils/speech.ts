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

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  );
}

export function startSpeechRecognition(options?: {
  maxAlternatives?: number;
  continuous?: boolean;
  onInterim?: (text: string) => void;
}): { promise: Promise<string>; stop: () => void } {
  const SpeechRecognition =
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      promise: Promise.reject(new Error("SpeechRecognition not supported")),
      stop: () => {},
    };
  }

  const recognition = new (SpeechRecognition as new () => SpeechRecognition)();
  recognition.lang = "zh-CN";
  recognition.interimResults = !!options?.onInterim;
  recognition.maxAlternatives = options?.maxAlternatives ?? 3;
  recognition.continuous = options?.continuous ?? false;

  let finalTranscript = "";
  let stopped = false;

  const promise = new Promise<string>((resolve, reject) => {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (options?.onInterim && interim) {
        options.onInterim(finalTranscript + interim);
      }
    };

    recognition.onend = () => {
      resolve(finalTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        resolve(finalTranscript || "");
      } else {
        reject(new Error(event.error));
      }
    };

    recognition.start();
  });

  const stop = () => {
    if (!stopped) {
      stopped = true;
      recognition.stop();
    }
  };

  return { promise, stop };
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

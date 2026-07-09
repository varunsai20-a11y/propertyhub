import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { formatINRFull } from "../lib/format";

export function NeighborhoodVibe({
  quote,
  audioClip,
  ownerName,
}: {
  quote: string;
  audioClip: string | null;
  ownerName: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioClip) {
      const el = document.getElementById("vibe-audio") as HTMLAudioElement | null;
      if (!el) return;
      if (playing) {
        el.pause();
      } else {
        el.play();
      }
      setPlaying(!playing);
      el.ontimeupdate = () => {
        setProgress((el.currentTime / el.duration) * 100 || 0);
      };
      el.onended = () => {
        setPlaying(false);
        setProgress(0);
      };
      return;
    }

    // Fallback: browser speech synthesis for the owner's quote
    if (!("speechSynthesis" in window)) {
      setPlaying(false);
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      setProgress(0);
      return;
    }

    // Build a longer narration by repeating context so it fills ~30 seconds
    const narration =
      `Here's what the owner says about this property. ${quote} ` +
      `The owner, ${ownerName}, adds: ${quote}`;

    const u = new SpeechSynthesisUtterance(narration);
    u.rate = 0.82;   // slower pace ≈ 30 s for most quote lengths
    u.pitch = 1;
    u.onend = () => {
      setPlaying(false);
      setProgress(100);
    };
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);

    // Always track against a fixed 30-second window
    const DURATION_MS = 30_000;
    const start = Date.now();
    const tick = setInterval(() => {
      const t = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100);
      setProgress(t);
      if (t >= 100) clearInterval(tick);
    }, 200);
  };

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
          <Icon.Sparkle size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-deep">
            Neighborhood Vibe
          </h3>
          <p className="text-xs text-brand-mute">
            30-second audio from the owner
          </p>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-brand-orange pl-4 text-sm italic text-brand-ink">
        "{quote}"
        <footer className="mt-1 text-xs not-italic text-brand-mute">
          — {ownerName}
        </footer>
      </blockquote>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-card transition hover:bg-brand-orange-hover"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Icon.Pause size={20} /> : <Icon.Play size={20} />}
        </button>
        <div className="flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-line">
            <div
              className="h-full rounded-full bg-brand-orange transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-brand-mute">
            <span>{audioClip ? "Audio clip" : "Text-to-speech"}</span>
            <span>{formatTime((progress / 100) * 30)} / 30s</span>
          </div>
        </div>
      </div>
      {audioClip && (
        <audio id="vibe-audio" src={audioClip} preload="none" />
      )}
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
}

export function OrderSuccessModal({ isOpen }: OrderSuccessModalProps) {
  const audioRef = useRef<AudioContext | null>(null);
  const confettiTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Create confetti pieces
    const createConfetti = () => {
      const confettiPieces: HTMLDivElement[] = [];
      for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = Math.random() * 20 + '%';
        piece.style.backgroundColor = [
          '#FFD700', // Gold
          '#FF6B6B', // Red
          '#4ECDC4', // Teal
          '#95E1D3', // Mint
          '#F38181', // Pink
          '#AA96DA', // Purple
        ][Math.floor(Math.random() * 6)];
        piece.style.setProperty('--duration', (Math.random() * 0.8 + 1.6) + 's');
        piece.style.setProperty('--delay', Math.random() * 0.3 + 's');
        document.body.appendChild(piece);
        confettiPieces.push(piece);
      }

      // Remove confetti after animation
      confettiTimeoutRef.current = window.setTimeout(() => {
        confettiPieces.forEach(piece => piece.remove());
      }, 3200);
    };

    // Play a short synthesized party blaster sound
    const playPartySound = async () => {
      try {
        const AudioCtx = window.AudioContext || ((window as Record<string, unknown>).webkitAudioContext as typeof window.AudioContext);
        const ctx = new AudioCtx();
        audioRef.current = ctx;

        const master = ctx.createGain();
        master.connect(ctx.destination);
        master.gain.value = 0.001;

        // quick ramp up for punch
        master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.02);
        master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        // Sweep oscillator (tone)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);
        osc.connect(master);

        // Short noise burst for 'blaster' texture
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize / 4));
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highshelf';
        noiseFilter.frequency.value = 1000;
        noise.connect(noiseFilter);
        noiseFilter.connect(master);

        osc.start();
        noise.start();

        // stop
        osc.stop(ctx.currentTime + 0.6);
        noise.stop(ctx.currentTime + 0.6);

        // close context after a bit to free resources
        setTimeout(() => {
          try { ctx.close(); } catch (e) { /* ignore */ }
          audioRef.current = null;
        }, 1200);
      } catch (e) {
        // autoplay might block; ignore gracefully
        console.warn('Party sound not played:', e);
      }
    };

    createConfetti();
    playPartySound();

    return () => {
      // cleanup confetti
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }

        @keyframes checkmark-bounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmark-fill {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .confetti-piece {
          position: fixed;
          width: 10px;
          height: 10px;
          pointer-events: none;
          border-radius: 2px;
          transform-origin: center;
          animation: confetti-fall var(--duration) ease-in var(--delay) forwards;
          box-shadow: 0 1px 0 rgba(0,0,0,0.15);
        }

        /* Burst rays behind the check */
        .burst-ray {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 6px;
          height: 60px;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0));
          transform-origin: center bottom;
          opacity: 0;
          border-radius: 3px;
          animation: ray-pop 0.6s cubic-bezier(0.2,0.9,0.2,1) forwards;
        }

        @keyframes ray-pop {
          0% { transform: translate(-50%, -50%) scaleY(0.1); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translate(-50%, -150%) scaleY(1); opacity: 0; }
        }

        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0) 60%);
          border-radius: 50%;
          opacity: 0;
          animation: sparkle-pop 0.9s ease-out forwards;
        }

        @keyframes sparkle-pop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          40% { transform: translate(-50%, -120%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -200%) scale(0.6); opacity: 0; }
        }

        .success-container {
          animation: checkmark-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="success-container relative">
        {/* Outer circle ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/20 blur-2xl animate-pulse" style={{ width: '220px', height: '220px' }} />

        {/* Burst rays (12) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="burst-ray"
            style={{ transform: `translate(-50%, -50%) rotate(${(i * 30) - 180}deg)` }}
          />
        ))}

        {/* Sparkles (8) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 70 + Math.random() * 40;
          const left = 50 + Math.cos(angle) * (r / 2);
          const top = 50 + Math.sin(angle) * (r / 2);
          return (
            <div
              key={`s${i}`}
              className="sparkle"
              style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${Math.random() * 0.25}s` }}
            />
          );
        })}

        {/* Checkmark circle */}
        <div className="relative w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
          {/* Animated SVG checkmark */}
          <svg
            className="w-20 h-20 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: '100',
                animation: 'checkmark-fill 0.8s ease-out 0.2s forwards'
              }}
            />
          </svg>
        </div>

        {/* Text below checkmark */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-2">Order Placed!</h2>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>
      </div>
    </div>
  );
}

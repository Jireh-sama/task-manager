import { useState, useRef, useEffect, useCallback } from "react";

export function useHoldProgress({ duration = 750, onComplete, disabled = false } = {}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);
  const completedRef = useRef(false);

  const cancelHold = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    startTimeRef.current = null;
    setIsHolding(false);
    setProgress(0);
  }, []);

  const triggerComplete = useCallback(() => {
    cancelHold();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch {}
    }
    onComplete?.();
  }, [cancelHold, onComplete]);

  const startHold = useCallback(
    (e) => {
      if (disabled) return;
      if (e.type === "pointerdown" && e.button !== 0) return;

      completedRef.current = false;
      setIsHolding(true);
      setProgress(0);
      startTimeRef.current = performance.now();

      const updateProgress = (currentTime) => {
        if (!startTimeRef.current) return;
        const elapsed = currentTime - startTimeRef.current;
        const currentProgress = Math.min(elapsed / duration, 1);
        setProgress(currentProgress);

        if (currentProgress >= 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            triggerComplete();
          }
        } else {
          animFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };

      animFrameRef.current = requestAnimationFrame(updateProgress);
    },
    [disabled, duration, triggerComplete]
  );

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      if (!e.repeat && !isHolding) {
        e.preventDefault();
        startHold(e);
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      cancelHold();
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const holdProps = {
    onPointerDown: startHold,
    onPointerUp: cancelHold,
    onPointerLeave: cancelHold,
    onPointerCancel: cancelHold,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: cancelHold,
    onContextMenu: (e) => e.preventDefault(),
  };

  return {
    progress,
    isHolding,
    cancelHold,
    holdProps,
  };
}

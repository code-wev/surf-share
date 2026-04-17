"use client";

import { useEffect, useRef, useState } from "react";

const protectedMediaSelector = "img, video, canvas";
const screenshotBlockDurationMs = 1200;
const focusRestoreDelayMs = 180;

function isMediaTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(protectedMediaSelector));
}

function isScreenshotShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const keyCode = "keyCode" in event ? event.keyCode : 0;
  const isMacScreenshot = event.metaKey && event.shiftKey && (key === "3" || key === "4" || key === "5");
  const isWindowsSnip = (event.metaKey || event.ctrlKey) && event.shiftKey && key === "s";
  const isPrintScreen = key === "printscreen" || key === "prtsc" || keyCode === 44;

  return isMacScreenshot || isWindowsSnip || isPrintScreen;
}

export default function ContentProtectionGuard() {
  const [isCaptureBlocked, setIsCaptureBlocked] = useState(false);
  const unblockTimerRef = useRef<number | null>(null);
  const blockedUntilFocusRef = useRef(false);

  useEffect(() => {
    const clearUnblockTimer = () => {
      if (unblockTimerRef.current !== null) {
        window.clearTimeout(unblockTimerRef.current);
        unblockTimerRef.current = null;
      }
    };

    const triggerBlackout = (persistent = false) => {
      setIsCaptureBlocked(true);
      blockedUntilFocusRef.current = persistent;

      clearUnblockTimer();

      if (persistent) {
        return;
      }

      unblockTimerRef.current = window.setTimeout(() => {
        if (blockedUntilFocusRef.current) {
          return;
        }

        setIsCaptureBlocked(false);
        unblockTimerRef.current = null;
      }, screenshotBlockDurationMs);
    };

    const releasePersistentBlackout = () => {
      if (!blockedUntilFocusRef.current) {
        return;
      }

      blockedUntilFocusRef.current = false;

      clearUnblockTimer();

      unblockTimerRef.current = window.setTimeout(() => {
        setIsCaptureBlocked(false);
        unblockTimerRef.current = null;
      }, focusRestoreDelayMs);
    };

    const clearClipboard = () => {
      if (navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText("").catch(() => {
          // Ignore clipboard failures when permissions are unavailable.
        });
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      if (isMediaTarget(event.target)) {
        event.preventDefault();
      }
    };

    const onDragStart = (event: DragEvent) => {
      if (isMediaTarget(event.target)) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isCmdOrCtrl = event.ctrlKey || event.metaKey;

      if (isCmdOrCtrl && (key === "s" || key === "u" || key === "p")) {
        event.preventDefault();
      }

      if (isScreenshotShortcut(event)) {
        event.preventDefault();
        triggerBlackout();
        clearClipboard();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (isScreenshotShortcut(event)) {
        event.preventDefault();
        triggerBlackout();
        clearClipboard();
      }
    };

    const onWindowBlur = () => {
      // Best effort fallback: some OS snipping tools bypass keydown events.
      triggerBlackout(true);
    };

    const onWindowFocus = () => {
      releasePersistentBlackout();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        triggerBlackout(true);
        return;
      }

      releasePersistentBlackout();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      clearUnblockTimer();
    };
  }, []);

  if (!isCaptureBlocked) {
    return null;
  }

  return <div aria-hidden className="pointer-events-none fixed inset-0 z-9999 bg-black" />;
}

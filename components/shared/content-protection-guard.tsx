"use client";

import { useEffect, useRef } from "react";

const protectedMediaSelector = "img, video, canvas";
const screenshotBlockDurationMs = 900;

function isMediaTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(protectedMediaSelector));
}

function isScreenshotShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const keyCode = "keyCode" in event ? event.keyCode : 0;
  const isMacScreenshot =
    event.metaKey && event.shiftKey && (key === "3" || key === "4" || key === "5");
  const isWindowsSnip = (event.metaKey || event.ctrlKey) && event.shiftKey && key === "s";
  const isPrintScreen = key === "printscreen" || key === "prtsc" || keyCode === 44;

  return isMacScreenshot || isWindowsSnip || isPrintScreen;
}

export default function ContentProtectionGuard() {
  const unblockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearUnblockTimer = () => {
      if (unblockTimerRef.current !== null) {
        window.clearTimeout(unblockTimerRef.current);
        unblockTimerRef.current = null;
      }
    };

    const rootElement = document.documentElement;

    const triggerMediaBlackout = () => {
      rootElement.classList.add("capture-media-blackout");

      clearUnblockTimer();

      unblockTimerRef.current = window.setTimeout(() => {
        rootElement.classList.remove("capture-media-blackout");
        unblockTimerRef.current = null;
      }, screenshotBlockDurationMs);
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
        triggerMediaBlackout();
        clearClipboard();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (isScreenshotShortcut(event)) {
        event.preventDefault();
        triggerMediaBlackout();
        clearClipboard();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);

      clearUnblockTimer();
      rootElement.classList.remove("capture-media-blackout");
    };
  }, []);

  return null;
}

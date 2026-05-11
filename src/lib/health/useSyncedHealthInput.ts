"use client";

import { useEffect, useState } from "react";
import type { HealthInput } from "@/types/health";
import {
  getStoredHealthInput,
  HEALTH_INPUT_UPDATED_EVENT,
  saveStoredHealthInput,
} from "@/lib/health/storage";

export function useSyncedHealthInput() {
  const [input, setInputState] = useState<HealthInput>(() => getStoredHealthInput());

  useEffect(() => {
    setInputState(getStoredHealthInput());

    function handleUpdate(event: Event) {
      const customEvent = event as CustomEvent<HealthInput>;
      setInputState(customEvent.detail || getStoredHealthInput());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === "futurebody_health_input") {
        setInputState(getStoredHealthInput());
      }
    }

    window.addEventListener(HEALTH_INPUT_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(HEALTH_INPUT_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function setInput(next: HealthInput) {
    setInputState(next);
    saveStoredHealthInput(next);
  }

  function updateInput<K extends keyof HealthInput>(key: K, value: HealthInput[K]) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  return {
    input,
    setInput,
    updateInput,
  };
}

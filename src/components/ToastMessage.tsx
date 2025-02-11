'use client';

import {useEffect, useState} from "react";
import {ToastMessageProps} from "@/types/ToastMessageProps";

export default function ToastMessage({
                                       message,
                                       duration = 2000,
                                       onClose,
                                       variant = "error"
                                     }: ToastMessageProps) {
  const [progress, setProgress] = useState(100);

  const bgColor = variant === "error" ? "bg-red-500" : "bg-green-500";
  const progressContainerColor = variant === "error" ? "bg-red-300" : "bg-green-300";

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.max(100 - (elapsed / duration) * 100, 0);
      setProgress(percent);
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
      <div className={`fixed top-4 right-4 w-80 ${bgColor} text-white p-6 rounded shadow-lg z-50`}>
        <div className="text-lg font-medium text-center">{message}</div>
        <div className={`w-full h-2 ${progressContainerColor} mt-4 rounded`}>
          <div className="h-full bg-white rounded" style={{width: `${progress}%`}}></div>
        </div>
      </div>
  );
}

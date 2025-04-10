// components/DeliveryTimer.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { toZonedTime } from "date-fns-tz";
import { differenceInMilliseconds, getDay } from "date-fns";

const TARGET_HOUR = 15;
const TARGET_MINUTE = 0;
const TARGET_SECOND = 0;
const TIMEZONE = "Europe/Paris";

const formatTimeUnit = (unit: number): string => String(unit).padStart(2, "0");

const DeliveryTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = () => {
    try {
      const nowInParis = toZonedTime(new Date(), TIMEZONE);
      const currentDay = getDay(nowInParis);

      if (currentDay === 0 || currentDay === 6) {
        setIsVisible(false);
        setTimeLeft(null);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const targetTimeToday = new Date(nowInParis);
      targetTimeToday.setHours(TARGET_HOUR, TARGET_MINUTE, TARGET_SECOND, 0);

      const diff = differenceInMilliseconds(targetTimeToday, nowInParis);

      if (diff > 0) {
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft({ hours, minutes, seconds });
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setTimeLeft(null);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error("Error calculating time:", error);
      setIsVisible(false);
      setTimeLeft(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    calculateTimeLeft();

    intervalRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isVisible || !timeLeft) {
    return null;
  }

  return (
    <div className="p-2 my-3 border border-neutral-500 rounded-md shadow-md">
      <p className="text-center">🚚 Time left to receive your order tomorrow 🚚</p>
      <p className="text-center font-bold text-green text-xl">
        {formatTimeUnit(timeLeft.hours)}:{formatTimeUnit(timeLeft.minutes)}:{formatTimeUnit(timeLeft.seconds)}
      </p>
      <p className="text-xs text-center italic text-neutral-400">(Monday-Friday, France Metropolitaine only)</p>
    </div>
  );
};

export default DeliveryTimer;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { toZonedTime } from "date-fns-tz";
import { differenceInMilliseconds, getDay } from "date-fns";
import { twMerge } from "tailwind-merge";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

const TARGET_HOUR = 15;
const TARGET_MINUTE = 0;
const TARGET_SECOND = 0;
const TIMEZONE = "Europe/Paris";

const formatTimeUnit = (unit: number): string => String(unit).padStart(2, "0");

const DeliveryTimer: React.FC = () => {
  const t = useTranslations("productPage.timer");

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

      const targetTimeToday = toZonedTime(new Date(), TIMEZONE);
      targetTimeToday.setHours(TARGET_HOUR, TARGET_MINUTE, TARGET_SECOND, 0);

      const diff = differenceInMilliseconds(targetTimeToday, nowInParis);

      if (diff > 0) {
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft({ hours, minutes, seconds });
        if (!isVisible) setIsVisible(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible || !timeLeft) {
    return null;
  }

  // TODO: trad
  return (
    <div className={twMerge("p-3 my-4 border border-emerald-200 bg-emerald-50 rounded-md shadow-sm", "text-center")}>
      <ClockIcon className="h-6 w-6 text-emerald-600 mx-auto mb-1" />

      <p className="text-sm font-medium text-emerald-800">{t("mainText")}</p>

      <p className="font-bold text-green text-2xl tabular-nums my-1">
        {formatTimeUnit(timeLeft.hours)}:{formatTimeUnit(timeLeft.minutes)}:{formatTimeUnit(timeLeft.seconds)}
      </p>

      <p className="text-xs text-emerald-700 opacity-90">{t("disclaimer")}</p>
    </div>
  );
};

export default DeliveryTimer;

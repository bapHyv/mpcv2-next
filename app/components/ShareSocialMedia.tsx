"use client";

import { ShareIcon, LinkIcon } from "@heroicons/react/24/solid";
import { useAlerts } from "../context/alertsContext";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import useDeviceType from "@/app/hooks/useDeviceType";
import { useMemo } from "react";

interface Props {
  shortDescription: string;
}

export default function ShareSocialMedia({ shortDescription }: Props) {
  const { addAlert } = useAlerts();
  const deviceType = useDeviceType();

  const isDesktop = useMemo(() => {
    return deviceType === "desktop" || deviceType === "unknown";
  }, [deviceType]);

  const url = typeof window !== "undefined" ? window.location.href : null;
  const encodedUrl = useMemo(() => (url ? encodeURIComponent(url) : ""), [url]);
  const encodedDescription = useMemo(() => encodeURIComponent(shortDescription), [shortDescription]);

  const appUrls = useMemo(
    () => ({
      x: `twitter://post?message=${encodedDescription}%20${encodedUrl}`,
      facebook: `fb://share?url=${encodedUrl}`,
      threads: `threads://share?text=${encodedDescription}&url=${encodedUrl}`,
      whatsapp: `whatsapp://send?text=${encodedDescription}%20${encodedUrl}`,
      reddit: `reddit://submit?url=${encodedUrl}&title=${encodedDescription}`,
      telegram: `tg://msg?text=${encodedDescription}%20${encodedUrl}`,
    }),
    [encodedDescription, encodedUrl]
  );

  const webUrls = useMemo(
    () => ({
      x: `https://x.com/intent/tweet?text=${encodedDescription}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      threads: `https://threads.net/intent/post?source=${encodedUrl}&url=${encodedUrl}&text=${encodedDescription}`,
      whatsapp: `https://web.whatsapp.com/send?text=${encodedDescription}%20${encodedUrl}`,
      reddit: `http://www.reddit.com/submit?url=${encodedUrl}&title=${encodedDescription}`,
      telegram: `https://t.me/share/url?text=${encodedDescription}&url=${encodedUrl}`,
    }),
    [encodedDescription, encodedUrl]
  );

  const socials = useMemo(
    () => [
      {
        key: "X",
        href: isDesktop ? webUrls.x : appUrls.x,
        icon: (props: any) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 462.799"
            {...props}
          >
            <path
              fillRule="nonzero"
              d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
            />
          </svg>
        ),
      },
      {
        key: "facebook",
        href: isDesktop ? webUrls.facebook : appUrls.facebook,
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        key: "thread",
        href: isDesktop ? webUrls.threads : appUrls.threads,
        icon: (props: any) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 512"
            {...props}
          >
            <path d="M105 0h302c57.75 0 105 47.25 105 105v302c0 57.75-47.25 105-105 105H105C47.25 512 0 464.75 0 407V105C0 47.25 47.25 0 105 0z" />
            <path
              fill="#fff"
              fillRule="nonzero"
              d="M337.36 243.58c-1.46-.7-2.95-1.38-4.46-2.02-2.62-48.36-29.04-76.05-73.41-76.33-25.6-.17-48.52 10.27-62.8 31.94l24.4 16.74c10.15-15.4 26.08-18.68 37.81-18.68h.4c14.61.09 25.64 4.34 32.77 12.62 5.19 6.04 8.67 14.37 10.39 24.89-12.96-2.2-26.96-2.88-41.94-2.02-42.18 2.43-69.3 27.03-67.48 61.21.92 17.35 9.56 32.26 24.32 42.01 12.48 8.24 28.56 12.27 45.26 11.35 22.07-1.2 39.37-9.62 51.45-25.01 9.17-11.69 14.97-26.84 17.53-45.92 10.51 6.34 18.3 14.69 22.61 24.73 7.31 17.06 7.74 45.1-15.14 67.96-20.04 20.03-44.14 28.69-80.55 28.96-40.4-.3-70.95-13.26-90.81-38.51-18.6-23.64-28.21-57.79-28.57-101.5.36-43.71 9.97-77.86 28.57-101.5 19.86-25.25 50.41-38.21 90.81-38.51 40.68.3 71.76 13.32 92.39 38.69 10.11 12.44 17.73 28.09 22.76 46.33l28.59-7.63c-6.09-22.45-15.67-41.8-28.72-57.85-26.44-32.53-65.1-49.19-114.92-49.54h-.2c-49.72.35-87.96 17.08-113.64 49.73-22.86 29.05-34.65 69.48-35.04 120.16v.24c.39 50.68 12.18 91.11 35.04 120.16 25.68 32.65 63.92 49.39 113.64 49.73h.2c44.2-.31 75.36-11.88 101.03-37.53 33.58-33.55 32.57-75.6 21.5-101.42-7.94-18.51-23.08-33.55-43.79-43.48zm-76.32 71.76c-18.48 1.04-37.69-7.26-38.64-25.03-.7-13.18 9.38-27.89 39.78-29.64 3.48-.2 6.9-.3 10.25-.3 11.04 0 21.37 1.07 30.76 3.13-3.5 43.74-24.04 50.84-42.15 51.84z"
            />
          </svg>
        ),
      },
      {
        key: "whatsApp",
        href: isDesktop ? webUrls.whatsapp : appUrls.whatsapp,
        icon: (props: any) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 510 512.459"
            {...props}
          >
            <path
              fill="#111B21"
              d="M435.689 74.468C387.754 26.471 324 .025 256.071 0 116.098 0 2.18 113.906 2.131 253.916c-.024 44.758 11.677 88.445 33.898 126.946L0 512.459l134.617-35.311c37.087 20.238 78.85 30.891 121.345 30.903h.109c139.949 0 253.88-113.917 253.928-253.928.024-67.855-26.361-131.645-74.31-179.643v-.012zm-179.618 390.7h-.085c-37.868-.011-75.016-10.192-107.428-29.417l-7.707-4.577-79.886 20.953 21.32-77.889-5.017-7.987c-21.125-33.605-32.29-72.447-32.266-112.322.049-116.366 94.729-211.046 211.155-211.046 56.373.025 109.364 22.003 149.214 61.903 39.853 39.888 61.781 92.927 61.757 149.313-.05 116.377-94.728 211.058-211.057 211.058v.011zm115.768-158.067c-6.344-3.178-37.537-18.52-43.358-20.639-5.82-2.119-10.044-3.177-14.27 3.178-4.225 6.357-16.388 20.651-20.09 24.875-3.702 4.238-7.403 4.762-13.747 1.583-6.343-3.178-26.787-9.874-51.029-31.487-18.86-16.827-31.597-37.598-35.297-43.955-3.702-6.355-.39-9.789 2.775-12.943 2.849-2.848 6.344-7.414 9.522-11.116s4.225-6.355 6.343-10.581c2.12-4.238 1.06-7.937-.522-11.117-1.584-3.177-14.271-34.409-19.568-47.108-5.151-12.37-10.385-10.69-14.269-10.897-3.703-.183-7.927-.219-12.164-.219s-11.105 1.582-16.925 7.939c-5.82 6.354-22.209 21.709-22.209 52.927 0 31.22 22.733 61.405 25.911 65.642 3.177 4.237 44.745 68.318 108.389 95.812 15.135 6.538 26.957 10.446 36.175 13.368 15.196 4.834 29.027 4.153 39.96 2.52 12.19-1.825 37.54-15.353 42.824-30.172 5.283-14.818 5.283-27.529 3.701-30.172-1.582-2.641-5.819-4.237-12.163-7.414l.011-.024z"
            />
          </svg>
        ),
      },
      {
        key: "reddit",
        href: isDesktop ? webUrls.reddit : appUrls.reddit,
        icon: (props: any) => (
          <svg
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            {...props}
          >
            <circle cx="-892" cy="179" r="262" fill="#ff4500" transform="matrix(.9771 0 0 .9771 1127.57 81.1)" />
            <g transform="translate(1.249 1.608) scale(1.99024)">
              <circle cx="200.6" cy="123.7" r="29.9" fill="url(#prefix___Radial1)" />
              <circle cx="55.4" cy="123.7" r="29.9" fill="url(#prefix___Radial2)" />
              <ellipse cx="128.1" cy="149.3" rx="85.3" ry="64" fill="url(#prefix___Radial3)" />
              <path
                d="M102.8 143.1c-.5 10.8-7.7 14.8-16.1 14.8-8.4 0-14.8-5.6-14.3-16.4.5-10.8 7.7-18 16.1-18 8.4 0 14.8 8.8 14.3 19.6zM183.6 141.5c.5 10.8-5.9 16.4-14.3 16.4s-15.6-3.9-16.1-14.8c-.5-10.8 5.9-19.6 14.3-19.6s15.6 7.1 16.1 18z"
                fill="#842123"
                fillRule="nonzero"
              />
              <path
                d="M153.3 144.1c.5 10.1 7.2 13.8 15 13.8s13.8-5.5 13.4-15.7c-.5-10.1-7.2-16.8-15-16.8s-13.9 8.5-13.4 18.7z"
                fill="url(#prefix___Radial4)"
                fillRule="nonzero"
              />
              <path
                d="M102.8 144.1c-.5 10.1-7.2 13.8-15 13.8s-13.8-5.5-13.3-15.7c.5-10.1 7.2-16.8 15-16.8s13.8 8.5 13.3 18.7z"
                fill="url(#prefix___Radial5)"
                fillRule="nonzero"
              />
              <path
                d="M128.1 165.1c-10.6 0-20.7.5-30.1 1.4-1.6.2-2.6 1.8-2 3.2 5.2 12.3 17.6 21 32.1 21s26.8-8.6 32.1-21c.6-1.5-.4-3.1-2-3.2-9.4-.9-19.5-1.4-30.1-1.4z"
                fill="#bbcfda"
                fillRule="nonzero"
              />
              <path
                d="M128.1 167.5c-10.6 0-20.7.5-30 1.5-1.6.2-2.6 1.8-2 3.3 5.2 12.5 17.6 21.3 32 21.3 14.4 0 26.8-8.8 32-21.3.6-1.5-.4-3.1-2-3.3-9.4-1-19.5-1.5-30-1.5z"
                fill="#fff"
                fillRule="nonzero"
              />
              <path
                d="M128.1 166.2c-10.4 0-20.3.5-29.5 1.4-1.6.2-2.6 1.8-2 3.2 5.2 12.3 17.3 21 31.5 21s26.3-8.6 31.5-21c.6-1.5-.4-3.1-2-3.2-9.2-.8-19.1-1.4-29.5-1.4z"
                fill="url(#prefix___Radial6)"
                fillRule="nonzero"
              />
              <circle cx="174.8" cy="55.5" r="21.2" fill="url(#prefix___Radial7)" />
              <path
                d="M127.8 88c-2.5 0-4.6-1.1-4.6-2.7 0-19 15.4-34.4 34.4-34.4 2.5 0 4.6 2.1 4.6 4.6 0 2.5-2.1 4.6-4.6 4.6-13.9 0-25.2 11.3-25.2 25.2 0 1.7-2.1 2.7-4.6 2.7z"
                fill="url(#prefix___Radial8)"
                fillRule="nonzero"
              />
              <path
                d="M97.3 149.1c0 3.9-4.2 5.7-9.3 5.7-5.1 0-9.3-1.8-9.3-5.7 0-3.9 4.2-7.1 9.3-7.1 5.1 0 9.3 3.1 9.3 7.1zM177.5 149.1c0 3.9-4.2 5.7-9.3 5.7-5.1 0-9.3-1.8-9.3-5.7 0-3.9 4.2-7.1 9.3-7.1 5.1 0 9.3 3.1 9.3 7.1z"
                fill="#ff6101"
                fillRule="nonzero"
              />
              <ellipse cx="94.4" cy="134.8" rx="3.3" ry="3.6" fill="#ffc49c" />
              <ellipse cx="173.3" cy="134.8" rx="3.3" ry="3.6" fill="#ffc49c" />
            </g>
            <defs>
              <radialGradient
                id="prefix___Radial1"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(59.9015 0 0 -52.2545 201.012 107.557)"
              >
                <stop offset="0" stopColor="#feffff" />
                <stop offset=".4" stopColor="#feffff" />
                <stop offset=".51" stopColor="#f9fcfc" />
                <stop offset=".62" stopColor="#edf3f5" />
                <stop offset=".7" stopColor="#dee9ec" />
                <stop offset=".72" stopColor="#d8e4e8" />
                <stop offset=".76" stopColor="#ccd8df" />
                <stop offset=".8" stopColor="#c8d5dd" />
                <stop offset=".83" stopColor="#ccd6de" />
                <stop offset=".85" stopColor="#d8dbe2" />
                <stop offset=".88" stopColor="#ede3e9" />
                <stop offset=".9" stopColor="#ffebef" />
                <stop offset="1" stopColor="#ffebef" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(59.9015 0 0 -52.2545 55.892 107.557)"
              >
                <stop offset="0" stopColor="#feffff" />
                <stop offset=".4" stopColor="#feffff" />
                <stop offset=".51" stopColor="#f9fcfc" />
                <stop offset=".62" stopColor="#edf3f5" />
                <stop offset=".7" stopColor="#dee9ec" />
                <stop offset=".72" stopColor="#d8e4e8" />
                <stop offset=".76" stopColor="#ccd8df" />
                <stop offset=".8" stopColor="#c8d5dd" />
                <stop offset=".83" stopColor="#ccd6de" />
                <stop offset=".85" stopColor="#d8dbe2" />
                <stop offset=".88" stopColor="#ede3e9" />
                <stop offset=".9" stopColor="#ffebef" />
                <stop offset="1" stopColor="#ffebef" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial3"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(180.687 0 0 -126.865 130.347 99.176)"
              >
                <stop offset="0" stopColor="#feffff" />
                <stop offset=".4" stopColor="#feffff" />
                <stop offset=".51" stopColor="#f9fcfc" />
                <stop offset=".62" stopColor="#edf3f5" />
                <stop offset=".7" stopColor="#dee9ec" />
                <stop offset=".72" stopColor="#d8e4e8" />
                <stop offset=".76" stopColor="#ccd8df" />
                <stop offset=".8" stopColor="#c8d5dd" />
                <stop offset=".83" stopColor="#ccd6de" />
                <stop offset=".85" stopColor="#d8dbe2" />
                <stop offset=".88" stopColor="#ede3e9" />
                <stop offset=".9" stopColor="#ffebef" />
                <stop offset="1" stopColor="#ffebef" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial4"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(-15.0964 0 0 22.1628 165.28 150.971)"
              >
                <stop offset="0" stopColor="#f60" />
                <stop offset=".5" stopColor="#ff4500" />
                <stop offset=".7" stopColor="#fc4301" />
                <stop offset=".82" stopColor="#f43f07" />
                <stop offset=".92" stopColor="#e53812" />
                <stop offset="1" stopColor="#d4301f" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial5"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(15.0964 0 0 22.1628 90.19 150.971)"
              >
                <stop offset="0" stopColor="#f60" />
                <stop offset=".5" stopColor="#ff4500" />
                <stop offset=".7" stopColor="#fc4301" />
                <stop offset=".82" stopColor="#f43f07" />
                <stop offset=".92" stopColor="#e53812" />
                <stop offset="1" stopColor="#d4301f" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial6"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(53.2322 0 0 -35.1106 128.369 194.908)"
              >
                <stop offset="0" stopColor="#172e35" />
                <stop offset=".29" stopColor="#0e1c21" />
                <stop offset=".73" stopColor="#030708" />
                <stop offset="1" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial7"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(46.7274 0 0 -46.7274 175.312 34.106)"
              >
                <stop offset="0" stopColor="#feffff" />
                <stop offset=".4" stopColor="#feffff" />
                <stop offset=".51" stopColor="#f9fcfc" />
                <stop offset=".62" stopColor="#edf3f5" />
                <stop offset=".7" stopColor="#dee9ec" />
                <stop offset=".72" stopColor="#d8e4e8" />
                <stop offset=".76" stopColor="#ccd8df" />
                <stop offset=".8" stopColor="#c8d5dd" />
                <stop offset=".83" stopColor="#ccd6de" />
                <stop offset=".85" stopColor="#d8dbe2" />
                <stop offset=".88" stopColor="#ede3e9" />
                <stop offset=".9" stopColor="#ffebef" />
                <stop offset="1" stopColor="#ffebef" />
              </radialGradient>
              <radialGradient
                id="prefix___Radial8"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(38.3003 0 0 -38.3003 155.84 85.046)"
              >
                <stop offset="0" stopColor="#7a9299" />
                <stop offset=".48" stopColor="#7a9299" />
                <stop offset=".67" stopColor="#172e35" />
                <stop offset=".75" />
                <stop offset=".82" stopColor="#172e35" />
                <stop offset="1" stopColor="#172e35" />
              </radialGradient>
            </defs>
          </svg>
        ),
      },
      {
        key: "telegram",
        href: isDesktop ? webUrls.telegram : appUrls.telegram,
        icon: (props: any) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 512"
            {...props}
          >
            <defs>
              <linearGradient id="prefix__a" gradientUnits="userSpaceOnUse" x1="256" y1="3.84" x2="256" y2="512">
                <stop offset="0" stopColor="#2AABEE" />
                <stop offset="1" stopColor="#229ED9" />
              </linearGradient>
            </defs>
            <circle fill="url(#prefix__a)" cx="256" cy="256" r="256" />
            <path
              fill="#fff"
              d="M115.88 253.3c74.63-32.52 124.39-53.95 149.29-64.31 71.1-29.57 85.87-34.71 95.5-34.88 2.12-.03 6.85.49 9.92 2.98 2.59 2.1 3.3 4.94 3.64 6.93.34 2 .77 6.53.43 10.08-3.85 40.48-20.52 138.71-29 184.05-3.59 19.19-10.66 25.62-17.5 26.25-14.86 1.37-26.15-9.83-40.55-19.27-22.53-14.76-35.26-23.96-57.13-38.37-25.28-16.66-8.89-25.81 5.51-40.77 3.77-3.92 69.27-63.5 70.54-68.9.16-.68.31-3.2-1.19-4.53s-3.71-.87-5.3-.51c-2.26.51-38.25 24.3-107.98 71.37-10.22 7.02-19.48 10.43-27.77 10.26-9.14-.2-26.72-5.17-39.79-9.42-16.03-5.21-28.77-7.97-27.66-16.82.57-4.61 6.92-9.32 19.04-14.14z"
            />
          </svg>
        ),
      },
    ],
    [
      appUrls.facebook,
      appUrls.reddit,
      appUrls.telegram,
      appUrls.threads,
      appUrls.whatsapp,
      appUrls.x,
      isDesktop,
      webUrls.facebook,
      webUrls.reddit,
      webUrls.telegram,
      webUrls.threads,
      webUrls.whatsapp,
      webUrls.x,
    ]
  );

  console.log(deviceType);
  return (
    url && (
      <div className="relative mt-12 xl:w-1/2">
        <div
          className={clsx(
            "w-3/4 absolute z-10 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 m-auto",
            "flex items-center justify-center gap-x-2",
            "bg-green text-white border border-black rounded-full"
          )}
        >
          <ShareIcon className="w-5 h-5 text-neutral-900" />
          <p>Share on social media</p>
        </div>
        <div>
          <div className="h-6"></div>
          <div className="flex gap-x-3 items-center justify-center">
            <LinkIcon
              className="w-6 h-6 text-neutral-900 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(url);
                addAlert(uuid(), "Le lien à été copié dans le presse-papier", "Lien copié", "emerald");
              }}
            />
            {socials.map((item) => (
              <a key={item.key} href={item.href} target="_blank" rel="noreferrer">
                <item.icon aria-hidden="true" className="h-6 w-6 cursor-pointer" />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

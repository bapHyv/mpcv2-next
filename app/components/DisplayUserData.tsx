"use client";

import { useAuth } from "../context/authContext";

export default function DisplayUserData() {
  const { userData } = useAuth();

  return (
    <div className="absolute bottom-0 z-[100000] bg-white max-h-[50dvh] max-w-[30dvw] overflow-scroll">
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}

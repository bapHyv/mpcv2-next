interface Options {
  Domain?: string;
  Expires?: number | Date; // number of days or a Date object
  "Max-Age"?: number; // in days
  Path?: string;
  SameSite?: "lax" | "strict" | "none";
  Secure?: boolean;
  Partitioned?: boolean;
}

export default function useCookies() {
  const addCookie = ({ name, value, options }: { name: string; value: string; options?: Options }) => {
    let cookieString = `${name}=${value}; `;

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        switch (key) {
          case "Secure":
          case "Partitioned":
            if (value) {
              cookieString += `${key}; `;
            }
            break;

          case "Expires":
            if (typeof value === "number") {
              // Convert days to milliseconds and add to current time
              const expirationDate = new Date(Date.now() + value * 24 * 60 * 60 * 1000);
              cookieString += `Expires=${expirationDate.toUTCString()}; `;
            } else if (value instanceof Date) {
              cookieString += `Expires=${value.toUTCString()}; `;
            }
            break;

          case "Max-Age":
            if (typeof value === "number") {
              // limit the number of days at 400
              const maxAgeInSeconds = value <= 400 ? value * 24 * 60 * 60 : 400 * 24 * 60 * 60;
              cookieString += `Max-Age=${maxAgeInSeconds}; `;
            }
            break;

          default:
            // Handle Domain, Path, SameSite, etc.
            if (value !== undefined && value !== null) {
              cookieString += `${key}=${value}; `;
            }
            break;
        }
      });
    }

    console.log(cookieString); // For debugging
    document.cookie = cookieString; // Set the cookie
  };

  return { addCookie };
}

/**
 *
 * "name1=value; name2=value;"
 *
 * options:
 *  -name
 *  -value
 *  -domain=example.com or subdomain.example.com
 *  -expires=date-in-UTCString-format
 *  -max-age=max-age-in-seconds
 *  -partitioned
 *  -path=/ (by default) test in other routes if cookie still here
 *  -samesite=lax, strict, none
 *  -secure
 */

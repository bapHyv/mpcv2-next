let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export async function fetchWrapper(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let response = await fetch(input, init);

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => fetch(input, init))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch("/api/refresh-token", {
        method: "POST",
      });

      if (!refreshResponse.ok) {
        console.error("Token refresh failed. Redirecting to login.");
        processQueue(new Error("Token refresh failed"));
        window.location.href = "/connexion";
        return Promise.reject(refreshResponse);
      }

      processQueue(null);

      response = await fetch(input, init);
    } catch (error) {
      processQueue(error);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}

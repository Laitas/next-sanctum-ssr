export const fetcher = async (
  url: string,
  params?: RequestInit & { includeXSRF?: boolean; token?: string }
) => {
  const includeXSRF = params?.includeXSRF ?? false;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${params?.token}`,
  };

  if (includeXSRF) {
    await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/sanctum/csrf-cookie", {
      credentials: "include",
    });
    // function getXSRFToken() {
    //   const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    //   return match ? decodeURIComponent(match[1]) : "";
    // }
    // headers["X-XSRF-TOKEN"] = getXSRFToken();
  }

  console.log(headers);

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
    credentials: "include",
    headers,
    ...params,
  });

  if (response.ok) {
    return { data: await response.json(), error: null };
  } else {
    console.log("error", response);
    return { data: await response.json(), error: response };
  }
};

const baseUrl = "http://localhost:3000/api";

export async function get(
  url: RequestInfo | URL,
  searchParams?: URLSearchParams,
  options?: RequestInit | undefined
) {
  const response = await fetch(
    `${baseUrl}/${url}${
      searchParams ? new URLSearchParams({ ...searchParams }).toString() : ""
    }`,
    {
      ...options,
      mode: "cors",
    }
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return await response.json();
}

export async function post(
  url: RequestInfo | URL,
  options?: RequestInit | undefined
) {
  const response = await fetch(`${baseUrl}/${url}`, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}

export async function patch(
  url: RequestInfo | URL,
  options?: RequestInit | undefined
) {
  const response = await fetch(`${baseUrl}/${url}`, {
    ...options,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}

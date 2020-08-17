export const fetcher = (url) =>
  fetch(url).then(async (res) => {
    const result = await res.json();

    if (res.status === 200) {
      return result;
    }

    return Promise.reject(result);
  });

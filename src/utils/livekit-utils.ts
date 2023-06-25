import { useEffect, useState } from 'react';

function useServerUrl(region?: string) {
  const [serverUrl, setServerUrl] = useState<string | undefined>();
  useEffect(() => {
    let endpoint =
      import.meta.env.MODE === 'development '
        ? `/video/api/url`
        : `https://www.sangyeop.shop/video/api/url`;
    if (region) {
      endpoint += `?region=${region}`;
    }
    fetch(endpoint).then(async res => {
      if (res.ok) {
        const body = await res.json();
        setServerUrl(body.url);
      } else {
        throw Error('Error fetching server url, check server logs');
      }
    });
  });
  return serverUrl;
}

export default useServerUrl;

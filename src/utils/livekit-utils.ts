import { useEffect, useState } from 'react';

function useServerUrl(region?: string) {
  const [serverUrl, setServerUrl] = useState<string | undefined>();
  useEffect(() => {
    let endpoint = `/video/api/url`;
    if (region) {
      endpoint += `?region=${region}`;
    }
    fetch(endpoint).then(async res => {
      if (res.ok) {
        const body = await res.json();
        console.log('🚀 ~ file: livekit-utils.ts:13 ~ fetch ~ body:', body);
        setServerUrl(body.url);
      } else {
        throw Error('Error fetching server url, check server logs');
      }
    });
  });
  return serverUrl;
}

export default useServerUrl;

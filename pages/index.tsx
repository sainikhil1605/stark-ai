
import ClientComponent from "@/components/ClientComponent";
import { fetchAccessToken } from "@humeai/voice";
import { useEffect, useState } from "react";

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {

    const getToken = async () => {
      const resp = await fetchAccessToken({
        apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
        clientSecret: String(process.env.NEXT_PUBLIC_HUME_CLIENT_SECRET),
      });

      setAccessToken(resp);
    }
    getToken();

  }, [])


  if (!accessToken) {
    return <div>Loading...</div>;
  }

  return <ClientComponent accessToken={accessToken} />;
}
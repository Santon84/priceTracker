import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = {ozon: 'https://www.ozon.ru/api/composer-api.bx/page/json/v2?url='}
const makeRequest = axios.create({
  baseURL: BASE_URL.ozon,
});



const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get(url);
        setData(res.data.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
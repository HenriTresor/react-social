// import  from 'react'

import { FC, useEffect, useState } from "react";
import axios from "axios";

const useFetch = (link: string, token: string): object => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(
    function () {
      let cancel = false;
      if (!cancel) {
        try {
          setIsLoading(true);
          axios.get(link, {headers : { 'authorization': `Bearer ${token}`}}).then((res) => {
            setIsLoading(false);
            setData(res.data);
          });
        } catch (error: any) {
          setIsLoading(false);
          setError(error.message);
        }
      }
      return function () {
        cancel = true;
      };
    },
    [link]
  );

  return { data, isLoading, error };
};

export default useFetch;

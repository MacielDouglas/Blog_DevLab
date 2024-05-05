import { useEffect } from "react";

function useEffectOnce(callback) {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useEffectOnce;

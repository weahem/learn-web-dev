import {useEffect, useState} from "react";

export function useRequest(load, parameter) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    load(parameter).then(
      data => { if (active) setResult({parameter, version, status: "success", data}); },
      () => { if (active) setResult({parameter, version, status: "error", data: null}); },
    );
    return () => { active = false; };
  }, [load, parameter, version]);

  const current = result?.parameter === parameter && result?.version === version ? result : null;
  return {
    data: current?.data ?? null,
    status: current?.status ?? "loading",
    reload: () => setVersion(value => value + 1),
  };
}

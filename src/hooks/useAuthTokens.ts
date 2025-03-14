import { useState, useEffect } from "react";

export function useAuthTokens() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [judgeToken, setJudgeToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserToken(localStorage.getItem("token"));
      setJudgeToken(localStorage.getItem("judgeToken"));
    }
  }, []);

  const updateTokens = () => {
    setUserToken(localStorage.getItem("token"));
    setJudgeToken(localStorage.getItem("judgeToken"));
  };

  return { userToken, judgeToken, updateTokens };
}
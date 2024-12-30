import { Box, useColorMode } from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";

const COMMENTS_ID = "comments-container";

const Giscus = (): JSX.Element => {
  const { colorMode } = useColorMode();

  const loadComments = useCallback(() => {
    // 기존 Giscus 위젯 제거
    const comments = document.getElementById(COMMENTS_ID);
    if (comments) comments.innerHTML = "";

    // 새로운 스크립트 추가
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "jinsoolve/jinsoolve-blog.comment");
    script.setAttribute("data-repo-id", "R_kgDONjwANQ");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDONjwANc4ClmcJ");
    script.setAttribute("data-mapping", "url");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", colorMode === "dark" ? "dark_protanopia" : "light_protanopia");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    if (comments) comments.appendChild(script);
  }, [colorMode]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return <Box mt="100px" className="giscus" id={COMMENTS_ID} />;
};

export default Giscus;
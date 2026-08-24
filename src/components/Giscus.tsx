import { Box, useColorMode } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const COMMENTS_ID = "comments-container";

const Giscus = (): JSX.Element => {
  const { colorMode } = useColorMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

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
    hasLoaded.current = true;
  }, [colorMode]);

  useEffect(() => {
    if (shouldLoad && !hasLoaded.current) loadComments();
  }, [loadComments, shouldLoad]);

  useEffect(() => {
    if (!hasLoaded.current) return;

    const frame = document.querySelector<HTMLIFrameElement>(".giscus-frame");
    frame?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: colorMode === "dark" ? "dark_protanopia" : "light_protanopia",
          },
        },
      },
      "https://giscus.app",
    );
  }, [colorMode]);

  return (
    <Box
      ref={containerRef}
      mt="100px"
      minHeight="120px"
      className="giscus"
      id={COMMENTS_ID}
    />
  );
};

export default Giscus;

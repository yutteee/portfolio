import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export const GiscusComments = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      id="comments"
      repo="yutteee/portfolio"
      repoId="R_kgDONXFRsQ"
      category="General"
      categoryId="DIC_kwDONXFRsc4CpVEP"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="ja"
      loading="lazy"
    />
  );
};

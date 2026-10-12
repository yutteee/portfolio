import matter from "gray-matter";
import { dump, load } from "js-yaml";

// gray-matterの既定エンジンは、js-yaml 4で削除されたsafeLoad/safeDumpを呼ぶ。
const engines = { yaml: { parse: load, stringify: dump } };

export const parseFrontmatter = ({ raw }) => matter(raw, { engines });

export const stringifyFrontmatter = ({ content, data, options = {} }) =>
  matter.stringify(content, data, { ...options, engines });

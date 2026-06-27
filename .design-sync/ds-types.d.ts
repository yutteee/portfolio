// Declaration barrel for design-sync (claude.ai/design).
// The storybook-shape converter discovers the exported component surface and
// extracts each component's props from this entry. It re-exports the real
// source components — it is NOT a runtime entry (that is ./entry.tsx).
export { BlogPost, type BlogPostProps } from "../src/ui/BlogPost";
export { Breadcrumb, type BreadcrumbProps } from "../src/ui/Breadcrumb";
export { Button, type ButtonProps } from "../src/ui/Button";
export { IconButton, type IconButtonProps } from "../src/ui/IconButton";
export { PageTitle, type PageTitleProps } from "../src/ui/PageTitle";
export { ProductItem, type ProductItemProps } from "../src/ui/ProductItem";
export { Scrap, type ScrapProps } from "../src/ui/Scrap";
export { Footer } from "../src/features/Footer";
export { AnimationIcon } from "../src/features/AnimationIcon";
export { Header } from "../src/features/Header";

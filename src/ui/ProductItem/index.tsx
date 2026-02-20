import type React from "react";
import styles from "./index.module.css";

export type ProductItemProps = {
  image: string;
  index: number;
  title: string;
  description: string;
  // TODO: slugではなくhrefを受け取るよう変更し、URL構築を親側に委譲する
  slug: string;
  alt: string;
};

export const ProductItem: React.FC<ProductItemProps> = ({ image, index, title, description, slug, alt }) => {
  return (
    <a
      className={styles.product}
      href={`/products/${slug}`}
      aria-label={title}
    >
      <div className={styles["index-parent"]}>
        <span className={styles.mask}>
          <img src={image} alt={alt} className={styles.image} width={400} height={250} />
        </span>
        <div className={styles.index}>0{index}</div>
      </div>
      <div className={styles.texts}>
        <div className={styles.link}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </a>
  );
};

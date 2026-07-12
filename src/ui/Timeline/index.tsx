import type React from "react";
import styles from "./index.module.css";

export type TimelineItem = {
  title: string;
  period: string;
  description: string[];
  image: string;
  alt: string;
};

export type TimelineProps = {
  items: TimelineItem[];
};

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={item.title} className={styles.item}>
          <div className={styles.header}>
            <span className={styles.period}>{item.period}</span>
            <h3 className={styles.title}>{item.title}</h3>
          </div>
          <div className={styles.body}>
            <div className={styles.description}>
              {item.description.map((desc) => (
                <p key={desc}>{desc}</p>
              ))}
            </div>
            <div className={styles.imageWrapper}>
              <img
                src={item.image}
                alt={item.alt}
                className={styles.image}
                width={400}
                height={250}
                loading="lazy"
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

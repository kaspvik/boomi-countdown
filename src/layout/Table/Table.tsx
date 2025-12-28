import React from "react";
import styles from "./Table.module.css";
import tableImg from "/table.png";

interface TableProps {
  className?: string;
}

export const Table: React.FC<TableProps> = ({ className }) => {
  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <img className={styles.image} src={tableImg} alt="Game table" />
    </div>
  );
};

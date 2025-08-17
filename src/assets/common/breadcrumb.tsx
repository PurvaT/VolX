"use client";
import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import styles from "../../styles/Home.module.css";
import { useParams, usePathname } from 'next/navigation';

interface BreadcrumbProps {
  separator?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ separator = ' / ' }) => {
  const router = useRouter();
  const path = usePathname();
  const pathnames = router.pathname.split('/').filter((x) => x);
  console.log("path = " ,path)

  return (
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb">
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link>
      </nav>
        {pathnames.map((value, index) => {
          const href = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <li key={href} className="breadcrumb-item">
              <Link href={href}>{value}</Link>
              {index < pathnames.length - 1 && <span>{separator}</span>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;

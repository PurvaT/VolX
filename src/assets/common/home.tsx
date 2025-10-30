import Link from 'next/link';
//import styles from '../../styles/Home.module.css';
import Card from 'app/assets/common/card';
import { favoriteItems } from '../../../data';
import { redirect, useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  return (
    // <div className={styles.container}>
    //   {/* Breadcrumb
    //   <nav className={styles.breadcrumb}>
    //     <Link href="/">Home</Link> / Categories
    //   </nav> */}
      
    //   {/* Page Header */}
    //   <h1 className={styles.title}>Welcome to the Home Page</h1>
    //   <div className={styles.cards}>
    //     {favoriteItems.map((f,index) => 
    //         <Card cardTitle={f} onClick={() => {router.push(`/commodity/${f}`)}} />
    //     )}
    //   </div>
    // </div>

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Home Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteItems.map((f, index) => 
          <Card key={index} cardTitle={f} onClick={() => {router.push(`/commodity/${f}`)}} />
        )}
      </div>
    </div>
  );
}

export default Home;
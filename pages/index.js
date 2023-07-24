import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'

import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date';
import Contacts from '../components/contacts';

import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {

  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}



export default function Home({allPostsData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
       
      </Head>
      
      <Contacts>

      </Contacts>


      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
  <h2 className={utilStyles.headingLg}>Projects</h2>
  <ul className={utilStyles.list}>
    {allPostsData.map(({ id, date, title, image}) => (
      <li className={`${utilStyles.listItem} projectCard`} key={id}>
        <div className="projectContent" style={{display: 'flex', alignItems: 'center'}}>
          <div style={{marginRight: '10px'}}>
            <Link href={`/posts/${id}`}>
              <span className="projectTitle">{title}</span>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </div>
          <div className="projectImageContainer">
            <Image
              className="projectImage"
              src={image}
              alt="Image description"
              width={250}
              height={250}
            />
          </div>
        </div>
      </li>
    ))}
  </ul>
  <style jsx>{`
    .projectCard {
      border: 1px solid #eaeaea;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      transition: box-shadow 0.1s ease-in;
    }
    .projectCard:hover {
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    }
    .projectContent {
      display: flex;
      align-items: center;
    }
    .projectTitle {
      font-size: 1.5em;
      color: #0070f3;
      cursor: pointer;
    }
    .projectImageContainer {
      flex-shrink: 0;
      width: 300px;
      height: 300px;
      margin-left: 15px;
    }
    .projectImage {
      border-radius: 5px;
      object-fit: cover;
    }
  `}</style>
</section>
    </Layout>
  );
}


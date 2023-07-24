import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

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
      
      <section className={utilStyles.headingMd}>
        <p>Welcome to my portfolio.🎈</p>
        <p>In this site i'll upload some interesting projects that will blown up your mind 🧨</p>
        <ul style={{ display: 'flex',gap: 10 }}>
          <li>
            <a href="https://www.linkedin.com/in/gabvill/" target="_blank" rel="noreferrer">
              <FaLinkedin style={{ marginRight: '5px', color: '#0077b5' }} size={20}/>
              
            </a> 
          </li>
          <li>
            <a href="https://twitter.com/GabrielAngelVi7" target="_blank" rel="noreferrer">
              <FaTwitter style={{ marginRight: '5px', color: '#1DA1F2' }} size={20}/>
            </a> 
          </li>
          <li>
            <a href="https://github.com/Bellota22/" target="_blank" rel="noreferrer">
              <FaGithub style={{ marginRight: '5px', color: 'black' }} size={20}/>
             
            </a> 
          </li>
          <li>
            <a href="mailto:gvillanuevavega@gmail.com" target="_blank" rel="noreferrer">
              <FaEnvelope style={{ marginRight: '5px', color: '#1DA1F2' }} size={20}/>
              gvillanuevavega@gmail.com
            </a> 
          </li>
        </ul>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Projects</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>{title}</Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}


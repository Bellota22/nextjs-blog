import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import utilStyles from '../styles/utils.module.css';

export default function Contacts(){
    return (
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
                gvillanuevavega@gmail.com</a> 
              </li>
            </ul>
          </section>
    );
  }
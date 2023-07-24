import utilStyles from '../styles/utils.module.css';

export default function Projects() {

    return (
        
<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
<h2 className={utilStyles.headingLg}>Projects</h2>
<ul className={utilStyles.list}>
  {allPostsData.map(({ id, date, title, image}) => (
    <li className={`${utilStyles.projectCard}`} key={id}>
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
        <div className={utilStyles.projectImageContainer}>
          <Image
            className={utilStyles.projectImage}
            src={image}
            alt="Image description"
            width={200}
            height={200}
          />
        </div>
      </div>
    </li>
  ))}
</ul>

</section>
    )
}
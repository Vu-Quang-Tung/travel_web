/* Khoi hien thi tieu de dau trang cho cac page */
function PageHero({ eyebrow, title, description }) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
        <h1 className="page-hero__title">{title}</h1>
        {description ? <p className="page-hero__description">{description}</p> : null}
      </div>
    </section>
  );
}

export default PageHero;

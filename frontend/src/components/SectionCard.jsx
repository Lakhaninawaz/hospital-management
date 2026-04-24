function SectionCard({ title, children }) {
  return (
    <section className="section-card">
      <div className="section-title">
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default SectionCard;

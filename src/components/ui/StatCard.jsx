const StatCard = ({ title, value, description }) => {
  return (
    <div className="stat-widget">
      <p className="stat-title">{title}</p>
      <h3>{value}</h3>
      <p className="stat-description">{description}</p>
    </div>
  )
}

export default StatCard

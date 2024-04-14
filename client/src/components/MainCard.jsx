import "../styles/MainCard.css"

const MainCard = ( { title, date } ) => {
  return (
    <div className="main-card">
      <p className="main-card-title"> { title } </p>
      <p className="main-card-date"> { date } </p>
    </div>
  )
};

export default MainCard;
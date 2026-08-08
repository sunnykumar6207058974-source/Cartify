function Loader({ text = "Loading Cartify..." }) {
  return (
    <div className="loader-overlay">
      <div className="spinner-box">
        <div className="pulse-spinner"></div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
}

export default Loader;

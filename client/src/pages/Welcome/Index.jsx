import SciencePicture1 from "../../assets/sceince-pic1.png";
import SciencePicture2 from "../../assets/sceince-pic2.png";
import "./Index.css";

const Welcome = () => {
  return (
    <div className="main-content">
      <img className="decoration-image dim-1" alt="science picture" src={SciencePicture1}></img>
      <img className="decoration-image dim-2" alt="science picture" src={SciencePicture2}></img>
    </div>
  );
};

export default Welcome;
import orgImage from '../assets/org.webp';
import '../app.css';
function Org() {

    return <>
        <h1>Our Orgchart</h1>
        <img style={{width: "50%"}} src={orgImage} alt='org'></img>
    </>
}

export default Org;
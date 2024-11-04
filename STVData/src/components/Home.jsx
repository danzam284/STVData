import '../App.css'
import { Link } from "react-router-dom";
function Home() {
    return <div>
        <h1>Our Homepage</h1>
        <div style={{display: "flex", justifyContent: "center", gap: "20px"}}>
            <Link to="/postgres">Postgres</Link>
            <Link to="/org">Org</Link>
            <Link to="/conceptPage">Concept Page</Link>
        </div>
    </div>
}

export default Home;
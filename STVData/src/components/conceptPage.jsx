import '../app.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ConceptPage() {
    const [inputWebsite, setInputWebsite] = useState('');
    const [response, setResponse] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:3000/websiteURL', {
                inputWebsite
            });
            setResponse(result.data);
        } catch (error) {
            setResponse(error.message);
        }
    };
    return <>
    <h1>Concept Page</h1>
    <div>
        <form onSubmit={handleSubmit}>
                <textarea class="input" name="inputWebsite" id="input" placeholder={"insert url here"} onChange={(e) => setInputWebsite(e.target.value)}></textarea>
                <input type="submit"></input>
        </form>
    </div>
    {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
    </>
}

export default ConceptPage;
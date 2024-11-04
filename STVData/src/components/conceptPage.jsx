import '../app.css';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

function ConceptPage() {
    const [inputWebsite, setInputWebsite] = useState('');
    const [csvFileName, setCsvFileName] = useState('data.csv');
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:3000/websiteURL', {
                inputWebsite,
                csvFileName
            });
            setResponse(result.data);
        } catch (error) {
            console.log(error);
            setResponse(error.message);
        }
    };

    return (
        <>
            <h1>Concept Page</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="input"
                        label="Insert URL here"
                        variant="outlined"
                        onChange={(e) => setInputWebsite(e.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <TextField
                        id="csvFileName"
                        label="CSV File Name"
                        variant="outlined"
                        value={csvFileName}
                        onChange={(e) => setCsvFileName(e.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <Button variant='contained' type='submit' color='primary'>
                        Submit
                    </Button>
                </form>
            </div>
            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </>
    );
}

export default ConceptPage;
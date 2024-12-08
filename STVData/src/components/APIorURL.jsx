import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:3000');

function APIorURL() {
    const [file, setFile] = useState(null);
    const [numLinks, setNumLinks] = useState(0);
    const [currentLink, setCurrentLink] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        socket.on('update', (idx, total, msg) => {
            setCurrentLink(idx);
            setData((prevData) => [...prevData, msg]);
            setNumLinks(total);
        });
    
        return () => {
          socket.off('update');
        };
      }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        setData([]);
        e.preventDefault();
    
        if (!file) {
          alert("Please select a file first!");
          return;
        }
    
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result;
          const useAI = document.getElementById("useAI").checked;
    
          socket.emit('fileUpload', fileData, useAI);
        };
    
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{background: "none", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <input type="file" accept='text/plain' onChange={handleFileChange} /><br></br>
                <div><span>Use AI?</span><input type='checkbox' id='useAI'></input></div><br></br>
                <button type="submit">Upload File</button>
            </form>

            {data.length > 0 &&
                <p>Retrieved {currentLink + 1} / {numLinks} results.</p>
            }

            {data.length > 0 &&
                data.map((entry) => (
                    <p key={entry}>{entry}</p>
                ))
            }
        </div>
    );
}

export default APIorURL;
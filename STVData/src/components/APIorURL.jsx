import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import Dataset from './Dataset';

const socket = io('http://localhost:3000');

function APIorURL() {
    const [file, setFile] = useState(null);
    const [numLinks, setNumLinks] = useState(0);
    const [currentLink, setCurrentLink] = useState(0);
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDataset, setCurrentDataset] = useState(null);
    const [currentOpened, setCurrentOpened] = useState("");

    const downloadToCSV = (data) => {
        if (!data || data.length === 0) return;
        const attributes = Object.keys(data[0]);
        const csvHeader = attributes.join(",");
        const csvRows = data.map((row) =>
            attributes.map((attr) => row[attr]).join(",")
        );
        const csvContent = [csvHeader, ...csvRows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "dataset.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        socket.on('update', (idx, total, msg, ruling, data) => {
            setCurrentLink(idx);
            setData((prevData) => [...prevData, [msg, ruling, data]]);
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
            <Modal 
                title={currentOpened}
                open={modalOpen} 
                onOk={() => setModalOpen(false)} 
                onCancel={() => setModalOpen(false)}
                footer={[
                    <button key="download" type="primary" onClick={() => downloadToCSV(currentDataset)}>
                        Download CSV
                    </button>,
                    <button key="close" onClick={() => setModalOpen(false)}>
                        Close
                    </button>
                ]}
            >
                {currentDataset ?
                    <Dataset data={currentDataset} /> :
                    <p>Loading data...</p>
                }
            </Modal>

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
                    <div key={entry[0]} style={{backgroundColor: "aliceblue", marginBottom: "10px", padding: "10px", color: "black", borderRadius: "10px"}}>
                        <h3><a href={entry[0].split(" ")[0]}> {entry[0].split(" ")[0]} </a></h3>
                        <p>{entry[0]}</p>
                        {
                            entry[1] === "Public API" ? 
                            <button onClick={() => {
                                setModalOpen(true);
                                setCurrentOpened(entry[0].split(" ")[0]);
                                setCurrentDataset(entry[2]);
                            }}>View Data</button> :
                            entry[1] === "URL" ?
                            <p>This data cannot be obtained until we implement scraping</p>:
                            <p>This data cannot be obtained unless you get an API key or other form of authentication</p>
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default APIorURL;
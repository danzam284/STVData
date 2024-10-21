import '../app.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

function Postgres() {
    const [data, setData] = useState(null);
    const [attributes, setAttributes] = useState(null);
    const [x, setX] = useState("day");
    const [y, setY] = useState("quant");
    let i = 0;

    useEffect(() => {
        async function getData() {
            const { data } = await axios.get("http://localhost:3000/data");
            const shuffledData = data.sort(() => 0.5 - Math.random());
            const entriesToKeep = Math.ceil(data.length * 0.01);
            const reducedData = shuffledData.slice(0, entriesToKeep);
            setData(reducedData);

            const singleRow = data[0];
            const attributes = Object.keys(singleRow);
            setAttributes(attributes);
        }

        getData();

    }, []);
    return <>
        <h1>Postgres</h1>
        {attributes &&
            <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                    <p>X axis</p>
                    <select value={x} name='x-axis' onChange={(e) => {setX(e.target.value)}}>
                        {attributes.map((attribute) => (
                            <option value={attribute}>{attribute}</option>
                        ))}
                    </select>
                </div>

                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                    <p>Y axis</p>
                    <select value={y} name='y-axis' onChange={(e) => {setY(e.target.value)}}>
                        {attributes.map((attribute) => (
                            <option value={attribute}>{attribute}</option>
                        ))}
                    </select>
                </div>
            </div>
        }

        {data ? 
            <ScatterChart
                width={600}
                height={300}
                series={[
                    {
                        label: 'Data',
                        data: data.map((v) => ({x: v[x], y: v[y], id: i++}))
                    }
                ]}
                xAxis={[{label: x}]}
                yAxis={[{label: y}]}
            />
         : 
         <p>Loading...</p>}
    </>
}

export default Postgres;
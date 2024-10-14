import '../app.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

function Postgres() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            const { data } = await axios.get("http://localhost:3000/data");
            const shuffledData = data.sort(() => 0.5 - Math.random());
            const entriesToKeep = Math.ceil(data.length * 0.01);
            const reducedData = shuffledData.slice(0, entriesToKeep);
            setData(reducedData);
        }

        getData();

    }, []);
    return <>
        <h1>Postgres</h1>
        {data ? 
            <ScatterChart
                width={600}
                height={300}
                series={[
                    {
                        label: 'Data',
                        data: data.map((v) => ({x: v.day, y: v.quant, id: v.cust}))
                    }
                ]}
            />
         : 
         <p>Loading...</p>}
    </>
}

export default Postgres;
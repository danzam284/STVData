import '../app.css';
import { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Table } from 'antd';

function Dataset({ data }) {
    const [attributes, setAttributes] = useState(null);
    const [columns, setColumns] = useState(null);
    const [x, setX] = useState("day");
    const [y, setY] = useState("quant");
    const [viewMode, setViewMode] = useState("table");
    let i = 0;

    useEffect(() => {
        async function getAttributes() {
            const attributes = Array.isArray(data) ? Object.keys(data[0]) : Object.keys(data);
            setAttributes(attributes);

            const columns = attributes.map((attribute) => ({
                title: attribute,
                dataIndex: attribute,
                key: attribute,
            }));
            setColumns(columns);
        }

        if (data && data.length > 0) {
            getAttributes();
        }

    }, [data]);

    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    return <>
        {viewMode === "table" ?
            <button onClick={() => setViewMode("chart")}>View Chart</button> :
            <button onClick={() => setViewMode("table")}>View Table</button>
        }
        
        {attributes && viewMode === "chart" && 
            <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                    <p>X axis</p>
                    <select value={x} name='x-axis' onChange={(e) => {setX(e.target.value)}}>
                        {attributes.map((attribute) => (
                            <option key={attribute} value={attribute}>{attribute}</option>
                        ))}
                    </select>
                </div>

                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                    <p>Y axis</p>
                    <select value={y} name='y-axis' onChange={(e) => {setY(e.target.value)}}>
                        {attributes.map((attribute) => (
                            <option key={attribute} value={attribute}>{attribute}</option>
                        ))}
                    </select>
                </div>
            </div>
        }

        {data && viewMode === "chart" ?
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
         data && viewMode === "table" ?
            <Table
                dataSource={data}
                columns={columns}
            /> :
            <p>Loading...</p>
        }
    </>
}

export default Dataset;
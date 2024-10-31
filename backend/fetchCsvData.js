import axios from 'axios';
import { parse } from 'json2csv';
import fs from 'fs';

export async function fetchAndSaveCsv(apiUrl, outputFilePath, limit = 1000) {
    let allData = [];
    let offset = 0;

    try {
        while (true) {
            // Fetch data with pagination parameters
            const response = await axios.get(`${apiUrl}?$limit=${limit}&$offset=${offset}`);
            const data = response.data;

            if (data.length === 0) break; // Break if no more data is returned

            allData = allData.concat(data); // Add new data to allData array
            offset += limit; // Increment offset for next request
        }

        // Convert the aggregated JSON data to CSV
        const csvData = parse(allData);
        fs.writeFileSync(outputFilePath, csvData);

        console.log(`Data saved to ${outputFilePath}`);
    } catch (error) {
        console.error("Error fetching or saving data:", error);
    }
}

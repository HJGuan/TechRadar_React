import apiUrl from "../config";

async function Entries() {
    try {
        console.log(apiUrl);
        console.log(`${apiUrl}/spots`)
        //http://localhost:3001/techradar/v1/spots
        const response = await fetch(`${apiUrl}/spots`, {  method: 'GET' });
        
        if (!response.ok) {
            throw new Error('Request failed');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export default Entries;
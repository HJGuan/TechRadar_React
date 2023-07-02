import React from "react"

async function Entries (){
    try {
        const response = await fetch('http://localhost:3003/techradar/v1/spots', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Request failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }

};

export default Entries;
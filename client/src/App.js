import React, {useEffect, useState} from 'react';

import Radar from './Components/Radar';

import AdminPanel from './Components/AdminPanel';
import AdminSelectionPanel from './Components/AdminSelectionPanel';
import AdminSelectionPanel_Muptiple from './Components/AdminSelectionPanel_Muptiple';
import AdminSelectionPanelSearch from './Components/AdminSelectionPanelSearch';
import InfoTable from './Components/InfoTable';
import InfoHeader from './Components/InfoHeader';
import Entries from './Components/Entries'
import './App.css';


function App() {
  
  const [entries, setEntries] = useState([])
  const [adminTrigger, setAdminTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [spotsSelected, setSpotsSelected] = useState([])
  
  useEffect(()=>{
    let isMounted = true;
    Entries().then(data=>{
      if (isMounted) {
        setEntries(data);
        setIsLoading(false);
      }
    })
    return () => {
      // cleanup to prevent updating state on unmounted component
      isMounted = false;
    };
  },[adminTrigger]);

  function handleAdminTrigger(){
    setAdminTrigger(!adminTrigger);
  };

  function handleSpotSelection(spots){
    setSpotsSelected(spots);
  }

  return (
    <div>
      {!isLoading ? (
      <div className="App">
        <InfoHeader/>
        <div className='Radar'>
          <div>
            <Radar
              entries={entries}
              onSelectSpot={(spots)=>handleSpotSelection(spots)}
            />
            <InfoTable className="info-table"/>
          </div>
        </div>
        <div className="Panel">
          <div className="Panel-title">
            <h1>Admin Panel</h1>
          </div>
          <AdminPanel onAdminTrigger={handleAdminTrigger} />
          {spotsSelected.length === 0 ? (
            <AdminSelectionPanelSearch
              entries={entries}
              onSelectSpot={(spots)=>handleSpotSelection(spots)}
            />
          ) : spotsSelected.length === 1 ? (
            <AdminSelectionPanel
              spots={spotsSelected}
              onAdminTrigger={handleAdminTrigger}
              handleCancel={() => setSpotsSelected([])}
            />
          ) : (
            <AdminSelectionPanel_Muptiple 
            spots={spotsSelected} 
            onSelectSpot={(spots)=>handleSpotSelection(spots)} 
            onAdminTrigger={handleAdminTrigger} />
          )}
        </div>
      </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;

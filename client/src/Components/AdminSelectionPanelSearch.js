import React, { useEffect, useState } from 'react';

import '../App.css';
import { Button, Form, Input, Radio , Select} from 'antd';


function AdminSelectionPanelSearch({entries,onSelectSpot}) {
  const [options,setOptions]=useState([]);
    
  useEffect(()=>{
    const updatedOptions = entries.map((tech) => ({
      value: tech._id,
      label: tech.label,
    }));
    setOptions(updatedOptions);
  }, [entries]);
  
  const [selectedId, setSelectedId] =useState([]);
  const [selected,setSelected] = useState([]);

  function handleChange (value){
    setSelectedId(value);
  }

  function handleSelect(){
    console.log("selectedId");
    console.log(selectedId);
    const updateSelected = selectedId.map((id) => {
      return entries.find((entry) => entry._id === id);
    });
    setSelected(updateSelected);
    onSelectSpot(updateSelected);
  }

  function handleListAll(){
    onSelectSpot(entries);
  }



  return (
    <div className='Form2'>
      <Form className='Form-body'>
        <div className='Form-title'>
            <h2>Search</h2>
        </div>
        <Form.Item>
          <Select
            mode="multiple"
            allowClear
            placeholder="Scan the Radar!"
            onChange={(value) => handleChange(value)}
            optionFilterProp="label" 
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 // Case-insensitive comparison
            }
            style={{ width: '100%' }}
            options={options}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSelect}>Select</Button>
          <Button type="link" onClick={handleListAll}> List all</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminSelectionPanelSearch;










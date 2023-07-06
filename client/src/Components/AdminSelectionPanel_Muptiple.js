import React, { useEffect, useState } from 'react';
import apiUrl from '../config';
import '../App.css';
import { Button, Form, Input, Radio , Select} from 'antd';
import { Table } from 'antd';


function AdminSelectionPanel_Muptiple({spots,onSelectSpot,onAdminTrigger}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'label',
    },
    {
      title: 'Quadrant',
      dataIndex: 'quadrant',
      filters: [
        {
          text: 'Languages',
          value: 'Languages',
        },
        {
          text: 'Infrastructure',
          value: 'Infrastructure',
        },
        {
          text: 'Datastores',
          value: 'Datastores',
        },
        {
          text: 'Data Management',
          value: 'Data Management',
        },
      ],
      onFilter: (value, record) => record.quadrant.indexOf(value) === 0,
      sorter: (a, b) => a.quadrant - b.quadrant,
    },
    {
      title: 'Ring',
      dataIndex: 'ring',
      filters: [
        {
          text: 'ADOPT',
          value: 'ADOPT',
        },
        {
          text: 'TRIAL',
          value: 'TRIAL',
        },
        {
          text: 'ASSESS',
          value: 'ASSESS',
        },
        {
          text: 'HOLD',
          value: 'HOLD',
        },
      ],
      onFilter: (value, record) => record.ring.indexOf(value) === 0,
      sorter: (a, b) => a.ring - b.ring,
    },
  ];



  const quadrantMappings = {
    0: "Languages",
    1: "Infrastructure",
    2: "Datastores",
    3: "Data Management",
  };

  const ringMappings = {
    0: "ADOPT",
    1: "TRIAL",
    2: "ASSESS",
    3: "HOLD",
  };

  useEffect(()=>{
    const updatedData = spots.map((spot) => ({
      key: spot._id,
      value: spot._id,
      label: spot.label,
      quadrant: quadrantMappings[spot.quadrant],
      ring: ringMappings[spot.ring],
    }));

    setData(updatedData);
  },[spots])

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  function handleCancel(){
    onSelectSpot([]);
  }
  
  async function handleBatchDelete(){
    console.log("selectedRowKeys");
    try {
      await fetch(`${apiUrl}/spots`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedRowKeys }),
      });
    } catch (error) {
      console.error(error);
    }
    onSelectSpot([]);
    onAdminTrigger();
  }



  return (
    <div className='Form3'>
      <Form className='Form-body'>
        <div className='Form-title'>
          <p>Current selections({spots.length} in total)</p>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
        <Form.Item>
          <Button type="primary" onClick={handleBatchDelete} >Batch Delete</Button>
          <Button htmlType="button" onClick={handleCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminSelectionPanel_Muptiple;










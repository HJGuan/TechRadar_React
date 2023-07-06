import React, { useEffect, useState } from 'react';
import apiUrl from '../config';
import '../App.css';
import { Button, Form, Input, Radio , Select} from 'antd';
const { Option } = Select;


function AdminSelectionPanel({spots, onAdminTrigger, handleCancel}) {
  const [form] = Form.useForm();
  const [techId,setTechId] = useState(spots[0]._id);
  const [techName, setTechName] = useState(spots[0].label);
  const [quadrants, setQuadrants] = useState(spots[0].quadrant);
  const [rings, setRings] = useState(spots[0].ring);


  useEffect(()=>{
    setTechId(spots[0]._id);
    setTechName(spots[0].label);
    setQuadrants(spots[0].quadrant);
    setRings(spots[0].ring);
    form.setFieldsValue({
        Name: spots[0].label,
        Quadrants: spots[0].quadrant,
        Rings: spots[0].ring,
    });
    
  },[spots])


  async function onUpdate() {
    try {
      await fetch(`${apiUrl}/spots/${techId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"label":techName,"quadrant":quadrants,"ring":rings})
      });
      onAdminTrigger();
    } catch (error) {
      console.error(error);
    }
  }

  async function onDelete() {
    try {
      await fetch(`${apiUrl}/spots/${techId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      onAdminTrigger();
    } catch (error) {
      console.error(error);
    }
  }

  function onCancel() {
    handleCancel();
  };

  return (
    <div className='Form2'>
      <Form form={form} className='Form-body'>
        <div className='Form-title'>
            <p>Current selection</p>
            <h2>{techName}</h2>
        </div>
        <Form.Item name="Name" label="Technology Name"  >
          <Input value={techName} onChange={(e) => setTechName(e.target.value)}/>
        </Form.Item>
        <Form.Item name="Quadrants" label="Quadrants" >
          <Select
            onChange={(value) => setQuadrants(value)}
            value={quadrants}
          >
            <Option value={2}>Datastores</Option>
            <Option value={3}>DataManagement</Option>
            <Option value={1}>Infrastructure</Option>
            <Option value={0}>Language</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Rings" name="Rings">
          <Radio.Group value={rings} onChange={(e) => setRings(e.target.value)}>
            <Radio.Button value={3}>Hold</Radio.Button>
            <Radio.Button value={2}>Assess</Radio.Button>
            <Radio.Button value={1}>Trial</Radio.Button>
            <Radio.Button value={0}>Adopt</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onUpdate}>Update</Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button  htmlType="button" onClick={onDelete}>
            Delete
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default AdminSelectionPanel;










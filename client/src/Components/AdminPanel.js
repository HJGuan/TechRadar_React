import React, { useState } from 'react';
import apiUrl from '../config';
import '../App.css';
import { Button, Form, Input, Radio , Select} from 'antd';
const { Option } = Select;


function AdminPanel({onAdminTrigger}) {
  const [form] = Form.useForm();
  const [techName, setTechName] = useState('');
  const [quadrants, setQuadrants] = useState('');
  const [rings, setRings] = useState('');


  function onAdd(){ 
    fetch(`${apiUrl}/spots`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"label":techName,"quadrant":quadrants,"ring":rings})
    }).catch (error=> {
        console.error(error);
    });
    onAdminTrigger();
  };

  function onCancel() {
    // Reset the form
    setTechName('');
    setQuadrants('');
    setRings('');
    form.setFieldsValue({
      Name: '',
      Quadrants: '',
      Rings: '',
  });
  };

  async function onClearAll() {
    try {
      await fetch(`${apiUrl}/spots`, {
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

  async function onInit() {
    try {
      await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    }
    onAdminTrigger();
  }


  return (
    <div className='Form'>
      <Form form={form} className='Form-body'>
        <div className='Form-title'>
          <h2>Add a New Tech</h2>
        </div>
        <Form.Item name="Name" label="Technology Name" onChange={(e) => setTechName(e.target.value)}>
          <Input placeholder="enter a new name to create a new node" />
        </Form.Item>
        <Form.Item name="Quadrants" label="Quadrants" >
          <Select
            placeholder="Select a Quadrant"
            onChange={(e) => setQuadrants(e)}
            allowClear
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
          <Button type="primary" onClick={onAdd}>looks good!</Button>
          <Button htmlType="button" onClick={onCancel}>
            clear input
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" htmlType="button" onClick={onClearAll}>
            Clear All
          </Button>
          <Button type="link" htmlType="button" onClick={onInit}>
            Initialize
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminPanel;










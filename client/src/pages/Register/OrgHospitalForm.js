import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react'
import { getAntdInputValidations } from '../../utils/helpers';

const OrgHospitalForm = ({type}) => {



  return (
    <>
        <Form.Item
            label={type==="hospital" ? "Hospital Name" : "Organization Name"}
            name={type==="hospital" ? "hospitalName" : "organizationName" }
            rules={getAntdInputValidations()}
        >
            <Input  />
        </Form.Item>

        
        <Form.Item name="owner" label="Owner" rules={getAntdInputValidations()}>
            <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={getAntdInputValidations()}>
            <Input />
        </Form.Item>


        <Form.Item name="phone" label="Phone" rules={getAntdInputValidations()}>
            <Input />
        </Form.Item>

        <Form.Item name="website" label="website" rules={getAntdInputValidations()}>
            <Input />
        </Form.Item>


        <Form.Item name="password" label="Password" rules={getAntdInputValidations()}>
            <Input type='password' />
        </Form.Item>



        <Form.Item name="address" label="Address" className='col-span-2' rules={getAntdInputValidations()}>
            <TextArea />
        </Form.Item>


    </>
  )
}

export default OrgHospitalForm;


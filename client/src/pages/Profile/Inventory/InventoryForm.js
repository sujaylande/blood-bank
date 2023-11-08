import { Form, Input, Modal, Radio, Select, message } from 'antd';
import React, { useState } from 'react'
import { getAntdInputValidations } from '../../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loaderSlice';
import { AddInventory } from '../../../apicalls/inventory';

const InventoryForm = ({open ,setOpen, reloadData}) => {

  const {currentUser} = useSelector((state)=>state.users);


  const dispatch = useDispatch();


  const [InventoryType, setInventoryType] = useState("in");


  const [form] = Form.useForm();

  const onFinish = async (values)=>{
    try{

      dispatch(SetLoading(true));
      
      const response = await AddInventory({
        ...values,
        InventoryType,
        organization: currentUser._id,
      })
      
      dispatch(SetLoading(false));

      if(response.success){
        reloadData();
        message.success('Inventory Added Successfully')
        setOpen(false);
      }
      else{
        throw new Error(response.message);
      }

    }
    catch(error){
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  }



  return (
    <Modal
    title="ADD INVENTORY"
    open={open}
    onCancel={()=>setOpen(false)}
    centered
    onOk={()=>form.submit()}
    >

    {/* form */}

    <Form layout='vertical' className='flex flex-col gap-5' form={form}
    onFinish={onFinish}
    >
      <Form.Item
      label="Inventory Type"
      
      >
        <Radio.Group 
        value={InventoryType}
        onChange={(e)=> setInventoryType(e.target.value)}
        >
          <Radio value="in">In</Radio>
          <Radio value="out">Out</Radio>
        </Radio.Group>
      </Form.Item>


      <Form.Item label="Blood Group" name="bloodGroup" rules={ getAntdInputValidations()} >

        <select name="" id="">
          <option value="a+">A+</option>
          <option value="a-">A-</option>
          <option value="b+">B+</option>
          <option value="b-">B-</option>
          <option value="o+">O+</option>
          <option value="o-">O-</option>
          <option value="ab+">AB+</option>
          <option value="ab-">AB-</option>
        </select>
      </Form.Item>

      {/* email verification */}

      <Form.Item label={InventoryType === "out" ? "Hospital Email"  : "Donor Email"} name="email">
        <Input type='email' />
      </Form.Item>

      {/* Quantity of blood in ml */}


      <Form.Item label="Quantity (ML)" name="quantity" rules={getAntdInputValidations()}>
        <Input type='number' />
      </Form.Item>

      


    </Form>

    

    </Modal>
  )
}

export default InventoryForm;

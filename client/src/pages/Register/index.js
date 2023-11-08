import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import OrgHospitalForm from "./OrgHospitalForm";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loaderSlice";
import { getAntdInputValidations } from "../../utils/helpers";

const Register = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

    const onFinish = async(values)=>{

      try{
        // api call:
        dispatch(SetLoading(true));
        const response = await RegisterUser({
          ...values,
          userType:type,
        });
        dispatch(SetLoading(false));

        if(response.success){
          message.success(response.message);
          navigate('/login');
        }
        else{
          throw new Error(response.message);
        }


      }
      catch(error){
        dispatch(SetLoading(false));
        message.error(error.message);
      }

    }


    
    useEffect(()=>{
      if(localStorage.getItem("token")){
        navigate('/');
      }
    },[])



  const [type, setType] = useState("donor");

  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2"

        onFinish={onFinish}
      >



      
        <h1 className="col-span-2 uppercase text-2xl">
          <span className="text-primary">{type.toUpperCase()}-Registeration</span>
          <hr />
        </h1>

        
      {/* radio group for changing between different routes */}

      <Radio.Group onChange={(e)=> setType(e.target.value)} value={type}
      className="col-span-2"
      >

        <Radio value="donor">Donor</Radio>
        <Radio value="hospital">Hospital</Radio>
        <Radio value="organization">Organization</Radio>

      </Radio.Group>


        {type === "donor" && (
          <>
            {" "}
            <Form.Item label="Name" name="name" rules={getAntdInputValidations()} >
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={getAntdInputValidations()}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" rules={getAntdInputValidations()}>
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={getAntdInputValidations()}>
              <Input type="password" />
            </Form.Item>
          </>
        )}

        {
            type !== 'donor' && 
            <OrgHospitalForm type={type} />
        }

        <Button type="primary" className="col-span-2" block 
        htmlType="submit" >
          Register
        </Button>

        <Link to={"/login"} className="col-span-2 text-center">
          Already have an account ? Login
        </Link>
      </Form>
    </div>
  );
};

export default Register;

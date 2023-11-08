import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, message } from "antd";
import { Link } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loaderSlice";
import { getAntdInputValidations } from "../../utils/helpers";

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await LoginUser({
        ...values,
        userType:type,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        // put data > token to localstorage:
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const [type, setType] = useState("donor");

  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid p-5 gap-5 w-1/3"
        onFinish={onFinish}
      >
        <h1 className="uppercase text-2xl">
          <span className="text-primary">{type.toUpperCase()} - Login</span>
          <hr />
        </h1>

        {/* radio group for changing between different routes */}

        <Radio.Group
          onChange={(e) => setType(e.target.value)}
          value={type}
          className=""
        >
          <Radio value="donor">Donor</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        <Form.Item label="Email" name="email" rules={getAntdInputValidations()}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={getAntdInputValidations()}
        >
          <Input type="password" />
        </Form.Item>

        <Button type="primary" className="" block htmlType="submit">
          Login
        </Button>

        <Link to={"/register"} className="text-center">
          Dont have an account ? Register
        </Link>
      </Form>
    </div>
  );
};

export default Login;

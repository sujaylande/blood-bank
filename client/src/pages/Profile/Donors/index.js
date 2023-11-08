import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loaderSlice";
import { GetInventory } from "../../../apicalls/inventory";
import { Table, message } from "antd";
import { getAllDonorsOfOrganization } from "../../../apicalls/users";
import { getDateFormat } from "../../../utils/helpers";

const Donors = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await getAllDonorsOfOrganization();
      dispatch(SetLoading(false));

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data}></Table>
    </div>
  );
};

export default Donors;

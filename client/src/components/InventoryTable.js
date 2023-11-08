import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getDateFormat } from '../utils/helpers';
import { SetLoading } from '../redux/loaderSlice';
import { GetInventory, GetInventoryWithFilters } from '../apicalls/inventory';
import { Table, message } from 'antd';

const InventoryTable = ({filters , userType}) => {


    
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    
    const dispatch = useDispatch();





    const columns = [
      {
        title:"Inventory Type",
        dataIndex: "InventoryType",
        render: (text)=> text.toUpperCase(),
        
      },
      
      {
        title:"Blood Group",
        dataIndex: "bloodGroup",
        render: (text)=> text.toUpperCase(),

      },
      {
        title:"Quantity",
        dataIndex: "quantity",
        render: (text)=> text+"ML"
      },
      {
        title:"Reference",
        dataIndex: "reference",
        render: (text, record) => {
          if (userType === "organization") {
            return record.InventoryType === "in"
              ? record.donor?.name
              : record.hospital?.hospitalName;
          } else {
            return record.organization.organizationName;
          }
      },
    },
      
      {
        title:"Date",
        dataIndex:'date',
        render: (text)=> getDateFormat(text),
      }

    ]


    const getData = async()=>{
      try{
        dispatch(SetLoading(true));
        const response = await GetInventoryWithFilters(filters);
        dispatch(SetLoading(false));

        if(response.success){
          setData(response.data);
        }
        else{
          throw new Error(response.message);
        }
      }
      catch(error){
        message.error(error.message);
        dispatch(SetLoading(false));
      }
    };


  // change columns for hospital or donor
  if (userType !== "organization") {
    // remove inventory type column
    columns.splice(0, 1);

    // change reference column to organization name
    columns[2].title = "Organization Name";

    // date column should be renamed taken date
    columns[3].title = userType === "hospital" ? "Taken Date" : "Donated Date";
  }

    useEffect(()=>{
      getData();
    },[])


  return (
  <div className="overflow-x-auto">
    <Table columns={columns} dataSource={data} className="mt-4" />
  </div>

  )
}

export default InventoryTable;

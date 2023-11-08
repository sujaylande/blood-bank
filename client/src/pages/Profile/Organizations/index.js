import React, { useEffect, useState } from 'react'
import { SetLoading } from '../../../redux/loaderSlice';
import { Modal, Table, message } from 'antd';
import { GetAllOrganizationsOfDonor, GetAllOrganizationsOfHospital} from '../../../apicalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { getDateFormat } from '../../../utils/helpers';
import InventoryTable from '../../../components/InventoryTable';

const Organization = ({userType}) => {


    const [showHistoryModel , setShowHistoryModel] = useState(false);

    const dispatch = useDispatch();

    const {currentUser} = useSelector((state)=>state.users);


    const [data, setData] = useState([]);

    const [selectedOrganisation, setSelectedOrganisation] = useState(null);
  
    const getData = async () => {
      try {
        dispatch(SetLoading(true));


        let response = null;
        if(userType === "hospital"){
            response = await GetAllOrganizationsOfHospital();
        }
        else{
            response = await GetAllOrganizationsOfDonor();
        }



        // const response = await userType==='donor'? GetAllOrganizationsOfDonor() : GetAllOrganizationsOfHospital();


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
        dataIndex: "organizationName",
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
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (text) => getDateFormat(text),
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => (
          <span
            className="underline text-md cursor-pointer"
            onClick={() => {
              setSelectedOrganisation(record);
              setShowHistoryModel(true);
            }}
          >
            History
          </span>
        ),
      },
    ];
  


  return (
    <div>
        <Table columns={columns} dataSource={data} ></Table>


        {
          showHistoryModel && (
            <>
              
                <Modal
                  title={`${
                    userType==="donor" ? "Donations History" : "Consumption History"
                  } in ${selectedOrganisation?.organizationName} `}
                  centered
                  open={showHistoryModel}
                  onCancel={()=>setShowHistoryModel(false)}
                  width={1000}
                >



                <InventoryTable filters={{
                  organization: selectedOrganisation._id,
                  [userType]:currentUser._id,
                }} />


                </Modal>
            </>
          )
        }

    </div>
  )
}

export default Organization;
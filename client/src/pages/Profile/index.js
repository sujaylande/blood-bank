import { Tabs } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Inventory from "./Inventory";
import Donors from "./Donors";
import Hospitals from "./Hospitals";

import Organization from "./Organizations";
import InventoryTable from "../../components/InventoryTable";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <div>
      <Tabs>
        {currentUser.userType === "organization" && (
          <>
            <Tabs.TabPane tab="Inventory" key="1">
                <Inventory />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Donors" key="2">
              <Donors />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Hospitals" key="3">
              <Hospitals />
            </Tabs.TabPane>
          </>
        )}

        {currentUser.userType === "donor" && 
        <>

          <Tabs.TabPane tab="Donations" key="4">

          <InventoryTable
              filters={{
                InventoryType:"in",
                donor: currentUser._id,
              }}

              userType="donor"

              />

          </Tabs.TabPane>

          <Tabs.TabPane tab="Organization" key="5">
              <Organization userType="donor" />
          </Tabs.TabPane>

        </>
        }


        {currentUser.userType === "hospital" && 
        (
        <>

          <Tabs.TabPane tab="Consumptions" key="6">
              <InventoryTable
              filters={{
                InventoryType:"out",
                hospital: currentUser._id,
              }}

              userType="hospital"

              />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Organization" key="7">
              <Organization userType="hospital" />
          </Tabs.TabPane>

        </>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;

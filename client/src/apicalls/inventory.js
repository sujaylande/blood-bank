import { axiosInstance } from ".";

export const AddInventory = (data)=>{
    return axiosInstance('post','/api/inventory/add', data);
}


export const GetInventory = (data)=>{
    return axiosInstance('get','/api/inventory/get');
}



// get inventory with filters

export const GetInventoryWithFilters = (data)=>{
    return axiosInstance('post', '/api/inventory/filter', {filters:data});
}
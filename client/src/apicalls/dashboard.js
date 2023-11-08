import { axiosInstance } from ".";


export const GetAllBloodGroupInventory = ()=>{
    return axiosInstance('get', '/api/dashboard/blood-groups-data')
}
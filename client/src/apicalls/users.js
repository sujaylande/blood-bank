import { axiosInstance } from ".";



// payload will be coming from the compoonent:
export const LoginUser = async (payload)=>{
    const response = await axiosInstance('post', '/api/users/login', payload);
    return response;
}




export const RegisterUser = async(payload)=>{
    const response = await axiosInstance('post', '/api/users/register', payload);
    return response;
}


export const GetCurrentUser = async ()=>{
    const response = await axiosInstance('get', '/api/users/get-current-user');
    return response;

}


export const getAllDonorsOfOrganization = () => {
    return axiosInstance('get','/api/users/get-all-donors')
}


export const getAllHospitalsOfOrganization = () => {
    return axiosInstance('get','/api/users/get-all-hospitals')
}



export const GetAllOrganizationsOfDonor = ()=>{
    return axiosInstance('get','/api/users/get-all-organization-for-donor')
}


export const GetAllOrganizationsOfHospital = ()=>{
    return axiosInstance('get','/api/users/get-all-organization-for-hospital')
}



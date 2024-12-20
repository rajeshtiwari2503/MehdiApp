import axios from "axios";

// const baseUrl= "http://192.168.159.22:5000"
 const baseUrl="https://mehdiappbackend.onrender.com"


const get=(url)=>{
    return axios.get(baseUrl+url)
}

const post=(url,obj)=>{
    return axios.post(baseUrl+url ,obj)
 }

 const patch=(url,obj)=>{
    return axios.patch(baseUrl+url ,obj)
 }

 const put=(url,obj)=>{
    return axios.put(baseUrl+url ,obj)
 }
 const deleteData=(url)=>{
    return axios.delete(baseUrl+url)
}

const func={
   get ,post,patch,put,deleteData,   
}

export default func;

import { useState, useEffect } from 'react';

// import { defaultAxios } from '../custom_axios/custom_axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const useFetch =async (path,options={}) => {
    const {skip} = options;
    const [getData, setData] = useState({isLoading:false,apiData:undefined,status:null,serverError:null});
    const [Params,setParams] = useState('')
    
    const userdata = await AsyncStorage.getItem('token')
    console.log('this is a token', userdata);
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    if(skip){
        return;
      }

    const fetchData = async () => {
      try {

        const {data,status} = await axios.get(`https://diwali-e-commerce-backend-n2a2.onrender.com/${path}`,{
                    signal: controller.signal,
                    params:Params,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userdata.Data.token}`
                    },
                });
        
            if (isMounted) {

                setData(prev => ({...prev,isLoading:false,apiData:data,status:status}));
      
            }
      
        } catch (error) {
            console.log(error)
            setData(prev => ({...prev,isLoading:false,serverError:error}))      
        } finally {
       
            setData(prev => ({...prev,isLoading:false}))
      
        }
    };

    fetchData();

    return () => {
        controller.abort();
        isMounted = false;
    };
  }, [path,Params,skip,userdata.Data.token]);

  return [getData,setData,setParams,Params];
};

export default useFetch;
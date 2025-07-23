import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetRealVirtualInstruments = () => {
    const [RealVirtualInstrumentsListLoading, setLoading] = useState(false);
    const [RealVirtualInstrumentsListData, setData] = useState(null);
    const [RealVirtualInstrumentsListError, setError] = useState(null);

    const getRealVirtualInstruments = async (line) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getRealVirtualInstruments, {line_id: line})
            .then((instruments) => {
                if (instruments !== undefined) {
                    let instrument_list = [];
                    if(instruments.neo_skeleton_instruments && instruments.neo_skeleton_instruments.length > 0){
                        const addObject = instruments.neo_skeleton_instruments.map(x=>{
                            let instObject = {...x};
                            instObject['type'] = 'real';
                            instObject['title'] = x.name;
                            return instObject;                            
                        })
                        instrument_list = [...instrument_list, ...addObject];                        
                    }
                    if(instruments.neo_skeleton_virtual_instruments && instruments.neo_skeleton_virtual_instruments.length >0){
                        const addVirtualObject = instruments.neo_skeleton_virtual_instruments.map(x=>{
                            let instObject = {...x};
                            instObject['type'] = 'virtual';
                            instObject['title'] = x.name;
                            return instObject;    
                        })
                        instrument_list = [...instrument_list, ...addVirtualObject];                        
                    }
                    setData(instrument_list);
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)

                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { RealVirtualInstrumentsListLoading, RealVirtualInstrumentsListData, RealVirtualInstrumentsListError, getRealVirtualInstruments };
}


export default useGetRealVirtualInstruments;
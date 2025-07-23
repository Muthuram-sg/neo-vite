import React, { useState ,useEffect} from "react";
import EnhancedTable from "components/Table/Table"; 
import { useRecoilState } from "recoil";
import { showEdgeData,edgeUpdateStatus } from "recoilStore/atoms";
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function Edge() {
  const { t } = useTranslation();
  const [edgeData,] = useRecoilState(showEdgeData);
  const [edgeStatus,] = useRecoilState(edgeUpdateStatus);
  const [tabledata, setTableData] = useState([])

    const headCells = [
        {
          id: 'id',
          numeric: false,
          disablePadding: true,
          label: t('Sno'),
        },
        {
          id: 'gatewayName',
          numeric: false,
          disablePadding: false,
          label: t('Gateway Name'),
        },
        {
          id: 'lastActive',
          numeric: false,
          disablePadding: false,
          label: t('Last Active'),
        },
        {
          id: 'Status',
          numeric: false,
          disablePadding: false,
          label: t('status'),
        }
      ];

      useEffect(() => {
          processedrows()
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [edgeData])

      const processedrows = () => {
          var temptabledata = []
          if (edgeData.length>0) {
              temptabledata = temptabledata.concat(edgeData.map((val, index) => {
                  return [index+1, val.name, moment(edgeStatus[val['name']]).format('DD/MM/YYYY, h:mm:ss a'),
                  parseInt(moment.duration(moment(moment()).diff(edgeStatus[val['name']])).asMinutes())>60? 'Offline' : 'Online']
              })
              )
          }
          setTableData(temptabledata)
      }
      
   return ( 
  
      <EnhancedTable
        headCells={headCells}
        data={tabledata}
        search={true}
        download={true}
        rawdata={edgeData}
        /> 
 
   );
}
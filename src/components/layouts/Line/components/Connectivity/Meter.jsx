import React, { useState ,useEffect} from "react";
import EnhancedTable from "components/Table/Table";
import { useRecoilState } from "recoil";
import moment from 'moment';
import { showMeterData,MeterUpdateStatus } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';

export default function Meter() {
  const { t } = useTranslation();
  const [meterData,] = useRecoilState(showMeterData);
  const [meterStatus,] = useRecoilState(MeterUpdateStatus);
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
          label: t('Instrumentname'),
        },
        {
          id: 'lastActive',
          numeric: false,
          disablePadding: false,
          label: t('Last Active'),
        },
        {
          id: 'status',
          numeric: false,
          disablePadding: false,
          label: t('status'),
        }
      ];

      useEffect(() => {
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meterData])

    const processedrows = () => {
        var temptabledata = []
        if (meterData.length>0) {
            // eslint-disable-next-line array-callback-return
            temptabledata = temptabledata.concat(meterData.map((val, index) => {
              
                return [index+1, val.name, moment(meterStatus[val['id']]).format('DD/MM/YYYY, h:mm:ss a'),
                val.status]
              // }
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
        rawdata={meterData}
        />
 
 
   );
}
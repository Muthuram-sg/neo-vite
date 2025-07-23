import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { currentUserRole, selectedPlant,snackMessage,snackType,snackToggle} from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import InstrumentPopUp from './Component/VIModal';
import useGetInstrumentFarmula from './hooks/useGetInstrumentFarmula'
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import LoadingScreen from "LoadingScreenNDL"
import moment from 'moment';


// NOSONAR start -  skip 

export default function VirutalInstrument() {
  const { t } = useTranslation();
  const [currUserRole] = useRecoilState(currentUserRole);
  const [, setInstrumentFormulaList] = useState([]);//NOSONAR
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setSearch] = useState("");//NOSONAR
  const [, setTotCount] = useState(0);//NOSONAR
  const { outDTLoading, outDTData, outDTError, getInstrumentFormulaList } = useGetInstrumentFarmula();
  const [tabledata, setTableData] = useState([])//NOSONAR
  const AddInstrumentRef = useRef();
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
// NOSONAR end -  skip 

  const processedrows = () => {
    let temptabledata = []
    if (outDTData !== null && outDTData.length > 0) {
      temptabledata = temptabledata.concat(outDTData.map((val, index) => {
        // NOSONAR -  skip next line
        return [
         index +1,val.name,val.formula, val.userByUpdatedBy && val.userByUpdatedBy.name ? val.userByUpdatedBy.name : "-",
         val.updated_ts ? moment(val.updated_ts).format("Do MMM YYYY") : "-"
        ]
      })
      )
    }
    setTableData(temptabledata)
  }


  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: t('S.No'),
  },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('Name'),
    },

    {
      id: 'formula',
      numeric: false,
      disablePadding: false,
      label: t('Formula'),
    },
    {
      id: 'Last Updated By',
      numeric: false,
      disablePadding: false,
      label: t('Last Updated By'),
  },
  {
      id: 'Last Updated On',
      numeric: false,
      disablePadding: false,
      label: t('Last Updated on'),
  }


  ];


  useEffect(() => {
   
    getInstrumentFormulaList(headPlant.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])
  useEffect(() => {
    if (
      outDTData !== null &&
      !outDTLoading &&
      !outDTError
    ) {
      setInstrumentFormulaList(outDTData);
      setTotCount(outDTData.length)
      setSearch("")
      processedrows()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outDTData])

  const handleFormulaCrudDialogEdit = (id, data) => {
    AddInstrumentRef.current.handleFormulaCrudDialogEdit(data);
  }
  const handleFormulaCrudDialogDelete = (id, data) => {
    // NOSONAR  -  skip next line

    if(headPlant && headPlant.node && headPlant.node.energy_contract && headPlant.node.energy_contract.contracts.length > 0){
      let contractVI = headPlant.node.energy_contract.contracts.map(x=>x.Entities.map(k=>k.VirtualInstr)).flat()
      let RemoveDuplicate = [...new Set(contractVI)]
      let nodeValue = RemoveDuplicate.includes(data.id)
      if(nodeValue){
          setOpenSnack(true)
          SetType('error')
          SetMessage(`Select Virtual Instrument ${data.name} is Maped as Actual in Contract tab `)
          return false

      }
  }
    AddInstrumentRef.current.handleFormulaCrudDialogDelete(data);
  }
  const handleFormulatDialogAdd = () => {
    AddInstrumentRef.current.handleFormulatDialogAdd();
  }
// console.log(outDTLoading,'outDTLoading')
  return (
    <React.Fragment>
      {
        outDTLoading && <LoadingScreen />
      }
      <InstrumentPopUp
        ref={AddInstrumentRef}
        headPlant={headPlant}
        getVIList={() => getInstrumentFormulaList(headPlant.id)}
      />
        <div className="h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <Typography value='Virtual Instrument' variant='heading-02-xs'  />
                        </div>

<div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark  p-4 max-h-[93vh] overflow-y-auto' >
        <EnhancedTable
          headCells={headCells}
          data={tabledata}
          buttonpresent={t("AddVirtualInstrument")}
          download={true}
          search={true}
          onClickbutton={handleFormulatDialogAdd}
          // NOSONAR start -  skip 
          actionenabled={currUserRole.id === 2 ? true : false}//NOSONAR
          rawdata={outDTData ? outDTData : []}//NOSONAR
          // NOSONAR end -  skip 
          handleEdit={(id, value) => handleFormulaCrudDialogEdit(id, value)}
          handleDelete={(id, value) => handleFormulaCrudDialogDelete(id, value)}
          enableDelete={true}
          enableEdit={true}
          breakAll
          breakid='formula'
          Buttonicon={Plus}
          verticalMenu={true}
                    groupBy={'virtual_instrument_settings'}
        />
      </div>

    </React.Fragment>
  )
}

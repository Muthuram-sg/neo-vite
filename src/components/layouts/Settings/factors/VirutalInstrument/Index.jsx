import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { currentUserRole, selectedPlant,snackMessage,snackType,snackToggle} from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import InstrumentPopUp from './Component/VIModal';
import useGetInstrumentFarmula from './hooks/useGetInstrumentFarmula'
import Plus from 'assets/neo_icons/Menu/plus.svg?react';


export default function VirutalInstrument() {
  const { t } = useTranslation();
  const [currUserRole] = useRecoilState(currentUserRole);
  const [, setInstrumentFormulaList] = useState([]);
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setSearch] = useState("");
  const [, setTotCount] = useState(0);
  const { outDTLoading, outDTData, outDTError, getInstrumentFormulaList } = useGetInstrumentFarmula();
  const [tabledata, setTableData] = useState([])
  const AddInstrumentRef = useRef();
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const processedrows = () => {
    var temptabledata = []
    if (outDTData !== null && outDTData.length > 0) {
      temptabledata = temptabledata.concat(outDTData.map((val, index) => {
        return [
        index+1, val.name,val.formula,val.id
        ]
      })
      )
    }
    setTableData(temptabledata)
  }


  const headCells = [
    {
      id: 'S.NO',
      numeric: false,
      disablePadding: true,
      label:  t("SNo"),
      width:100
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
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('Alert ID'),
      hide: true,
      display: "none",
      width: 100

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

  return (
    <React.Fragment>
      <InstrumentPopUp
        ref={AddInstrumentRef}
        headPlant={headPlant}
        getVIList={() => getInstrumentFormulaList(headPlant.id)}
      />

      <div className="p-4">
        <EnhancedTable
          headCells={headCells}
          data={tabledata}
          buttonpresent={t("AddInstrument")}
          download={true}
          search={true}
          onClickbutton={handleFormulatDialogAdd}
          actionenabled={currUserRole.id === 2 ? true : false}
          rawdata={outDTData ? outDTData : []}
          handleEdit={(id, value) => handleFormulaCrudDialogEdit(id, value)}
          handleDelete={(id, value) => handleFormulaCrudDialogDelete(id, value)}
          enableDelete={true}
          enableEdit={true}
          breakAll
          breakid='formula'
          Buttonicon={Plus}
          rowSelect={true}
          checkBoxId={"id"}

          
        />
      </div>

    </React.Fragment>
  )
}

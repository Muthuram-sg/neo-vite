import React, { forwardRef, useEffect, useImperativeHandle, useRef,useState } from 'react'; 
import Grid from 'components/Core/GridNDL'
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { changeNodeAtPath } from '@nosferatu500/react-sortable-tree'; 
import Infoicon from 'assets/iconmonstr-info-thin.svg?react';
import ParagraphText from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import Button from 'components/Core/ButtonNDL';
import useVirtualInstrumentList from 'Hooks/useVirtualInstrument';
import useInstrumentList from 'Hooks/useInstrumentList'
import { useRecoilState } from "recoil";
import { selectedPlant, currentHierarchyData, selectedNode, selectedPath} from "recoilStore/atoms";
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import IcondataDark from "assets/neo_icons/Equipments/dark";
const iconNames = ["Blower", "Circuit", "Compressor", "Energy", "Energy Meter", "Engine", "Gas Sensor", "Gauge", "Generator", "IOT", "Machinary", "Network", "Plant", "Power", "Pressure Gauge", "Processor", "Raspbery PI", "Robo Arm", "Solar Panel", "Temperature Sensor", "Turbine", "Vibration Sensor", "Voltage", "Washing Machine"]

let Iconarr = IcondataDark.map((val,i)=>{
    return {"id": i,"name": iconNames[i],"icon": val,"stroke": "#262626"}
}) 
// eslint-disable-next-line react-hooks/exhaustive-deps
const NodeContent = forwardRef((props, ref) => {
    const { t } = useTranslation(); 
    

    const [headPlant] = useRecoilState(selectedPlant);
    const [selectedNodes, setSelectedNode] = useRecoilState(selectedNode);
    const [selectedPaths] = useRecoilState(selectedPath);
    const [SelectedIcon,setSelectedIcon] = useState('');
    const [nodeIcon] = useState(null); 
    const [currentHierarchy, setCurrentHierarchy] = useRecoilState(currentHierarchyData);
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const { virtualInstrumentListLoading, virtualInstrumentListData,  virtualInstrumentList } = useVirtualInstrumentList();
    const { instrumentListLoading, instrumentListData,  instrumentList } = useInstrumentList();
    const nameRef = useRef();
    useImperativeHandle(ref, () => ({
        updateNode: () => {
            const name = nameRef && nameRef.current.value ? nameRef.current.value : "";
            props.updateNode(name, nodeIcon, null);
        }
    }))

    useEffect(() => {

        virtualInstrumentList(headPlant.id);
        instrumentList(headPlant.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])
    const handleNodeIconChange = (e) => {
      
        const icon = iconNames.indexOf(e.target.value);
        if (currentHierarchy && currentHierarchy.hierarchy) {
            let updatedTree = changeNodeAtPath({
                treeData: currentHierarchy.hierarchy,
                path: selectedPaths,
                getNodeKey,
                newNode: { ...selectedNodes, icon },
            });
            let cloneCurrentHierarchy = JSON.parse(JSON.stringify(currentHierarchy));
            cloneCurrentHierarchy['hierarchy'] = updatedTree;
            setCurrentHierarchy(cloneCurrentHierarchy)
        }
        setSelectedIcon(e.target.value)
        setSelectedNode({ ...selectedNodes, icon })
    }
    const handleSubNodeSelect = (e, type) => {
        if (e.target.value) {
            const subnodeType = selectedNodes.subnodeType ? selectedNodes.subnodeType : 'virtual';
            let tempNode = type === 'virtual' ? virtualInstrumentListData.filter(x => x.id === e.target.value)[0] : instrumentListData.filter(x => x.id === e.target.value)[0];
          
            let subnode = {
                "id": tempNode.id,
                "name": tempNode.name,
                "formula": type === 'virtual' ? tempNode.formula : tempNode.id
            }
            if (currentHierarchy && currentHierarchy.hierarchy) {
                let updatedTree = changeNodeAtPath({
                    treeData: currentHierarchy.hierarchy,
                    path: selectedPaths,
                    getNodeKey,
                    newNode: { ...selectedNodes, subnode, subnodeType },
                });
                let cloneCurrentHierarchy = JSON.parse(JSON.stringify(currentHierarchy));
                cloneCurrentHierarchy['hierarchy'] = updatedTree;
                setCurrentHierarchy(cloneCurrentHierarchy)
            }
          
            setSelectedNode({ ...selectedNodes, subnode, subnodeType })
        }
    }
    const handleNodeNameChange = (e) => {
     
        if (e.target.value) {
            const name = e.target.value;
            if (currentHierarchy && currentHierarchy.hierarchy) {
                let updatedTree = changeNodeAtPath({
                    treeData: currentHierarchy.hierarchy,
                    path: selectedPaths,
                    getNodeKey,
                    newNode: { ...selectedNodes, name }
                });
                let cloneCurrentHierarchy = JSON.parse(JSON.stringify(currentHierarchy));
                cloneCurrentHierarchy['hierarchy'] = updatedTree;
                setCurrentHierarchy(cloneCurrentHierarchy)
            }
            setSelectedNode({ ...selectedNodes, name });
        }
    }
    const clearSubnode = () => {
        let subNode = {};
        let subnodeType = "virtual";
        if (currentHierarchy && currentHierarchy.hierarchy) {
            let updatedTree = changeNodeAtPath({
                treeData: currentHierarchy.hierarchy,
                path: selectedPaths,
                getNodeKey,
                newNode: { ...selectedNodes, subNode, subnodeType }
            });
            let cloneCurrentHierarchy = JSON.parse(JSON.stringify(currentHierarchy));
            cloneCurrentHierarchy['hierarchy'] = updatedTree;
            setCurrentHierarchy(cloneCurrentHierarchy)
        }
      
        setSelectedNode({ ...selectedNodes, subNode, subnodeType })
    };
    const handleSubType = (e) => {
        const subnodeType = e.target.checked ? 'virtual' : "instrument";
        let subNode = {};
        if (currentHierarchy && currentHierarchy.hierarchy) {
            let updatedTree = changeNodeAtPath({
                treeData: currentHierarchy.hierarchy,
                path: selectedPaths,
                getNodeKey,
                newNode: { ...selectedNodes, subnodeType, subNode },
            });
            let cloneCurrentHierarchy = JSON.parse(JSON.stringify(currentHierarchy));
            cloneCurrentHierarchy['hierarchy'] = updatedTree;
            setCurrentHierarchy(cloneCurrentHierarchy)
        }
      
        setSelectedNode({ ...selectedNodes, subnodeType, subNode })
    }
   

    let switchChecked;

        if (selectedNodes && selectedNodes.subnodeType === 'instrument') {
        switchChecked = false;
        } else {
        switchChecked = true;
        }

    let options = [];

        if (selectedNodes && selectedNodes.subnodeType === 'instrument') {
        options = !instrumentListLoading && instrumentListData && instrumentListData.length > 0
            ? instrumentListData
            : [];
        } else {
        options = !virtualInstrumentListLoading && virtualInstrumentListData && virtualInstrumentListData.length > 0
            ? virtualInstrumentListData
            : [];
        }
     

    return (
        <div>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12}>
                    <div className='flex items-center'>
                        <ParagraphText  variant="label-01-s" value={`${t('Name')}(${t('Alias')})`}/>   
                        <ToolTip title={"actualname :"+(props.actualname ? props.actualname : "")+ "\n Type :"+(props.nodetype === "instrument" ? props.nodetype : props.subtype) } placement="bottom" >
                            <div style={{ marginTop: "3px", fontSize: ".5rem", marginLeft: "8px" }}>
                                <Infoicon />
                            </div>
                        </ToolTip> 
                    </div>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <InputFieldNDL
                        inputRef={nameRef}
                        disabled={!props.actualname || !props.isEdit}
                        value={selectedNodes && selectedNodes.name ? selectedNodes.name : ""}
                        onChange={handleNodeNameChange} />
                </Grid>
                <Grid item xs={12} sm={12}>
                   
                    <SelectBox
                        id="iconlist-node"
                        options={Iconarr}
                        keyId='name'
                        keyValue='name'
                        isMArray={false}
                        label={t('Icon')}
                        isIcon={true} 
                        // disabled={!props.actualname || !props.isEdit}
                        value={SelectedIcon}
                        onChange={handleNodeIconChange}
                    />
                    
                </Grid>
                {props.nodetype === "entity" &&
                <React.Fragment> 
                    <Grid item xs={12} sm={12}>
                    <CustomSwitch id={"switch"} switch={true} checked={switchChecked} onChange={handleSubType} primaryLabel="Instrument" secondaryLabel="VI" size="small"/>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                    <SelectBox 
                        id="subnode"
                        options={options}
                        isMArray={true} 
                        keyId='id'
                        auto
                        keyValue='name'
                        auto
                        label={t('Subnode')}
                        disabled={!props.isEdit}
                        value={(selectedNodes && selectedNodes.subnode && selectedNodes.subnode.id) && selectedNodes.subnode.id}
                        onChange={(e)=>handleSubNodeSelect(e,selectedNodes && selectedNodes.subnodeType === 'instrument'?'instrument':'virtual')}
                    />  
                    </Grid>
                    {props.isEdit &&
                    <Grid item xs={12} sm={12}>
                    <Button onClick={clearSubnode} type='ghost' value={t('Clear Subnode')} />
                    </Grid>}
                </React.Fragment> 
                }

            </Grid>
        </div>
    )
})
export default NodeContent;
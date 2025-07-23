import React from 'react';
import Grid from 'components/Core/GridNDL'
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import HierarchyTree from "./HierarchyTree";
import NodeList from './NodeList';
import AssetList from './AssetList';
import InstrumentList from './InstrumentList';

function HierarchyContent(props) {
  const classes = {
    workArea: {
      height: 'calc(100vh - 122px)',
      position: "relative",
    },
    workAreaBackground: {
      backgroundImage: 'radial-gradient(#3A3B3C 2px, transparent 0px) !important'
    }
  }
  const [curTheme] = useRecoilState(themeMode);
  const [NodeVal, setNodeVal] = React.useState('') 
  const addNode = (e, data) => {
    let currentNode = data.filter(x => x.id === e.target.value)[0]
    setNodeVal(e.target.value)
    if (currentNode && currentNode.id) {
      const newNode = { "id": currentNode.id, "type": "entity", "subtype": currentNode.entityTypeByEntityType && currentNode.entityTypeByEntityType.name ? currentNode.entityTypeByEntityType.name : "Line", "name": currentNode.name ? currentNode.name : "No Title", "actualname": currentNode.name ? currentNode.name : "No Title", "expanded": true, "icon": 10, "subnodeType": "", "subnode": {} };
      props.addNode(newNode)
    }
  }
  const addAsset = (e, data) => {
    let currentNode = data.filter(x => x.id === e.target.value)[0]
    if (currentNode && currentNode.id) {
      const newNode = { "id": currentNode.id, "type": "entity", "subtype": currentNode.entityTypeByEntityType && currentNode.entityTypeByEntityType.name ? currentNode.entityTypeByEntityType.name : "Asset", "name": currentNode.name ? currentNode.name : "No Title", "actualname": currentNode.name ? currentNode.name : "No Title", "expanded": true, "icon": 10, "subnodeType": "", "subnode": {} };
      props.addNode(newNode)
    }
  }
  const addInstrument = (e, data) => {
    let currentNode = data.filter(x => x.id === e.target.value)[0]
    if (currentNode && currentNode.id) {
      const newNode = { "id": currentNode.id, "type": "instrument", "subtype": currentNode.instrumentTypeByInstrumentType && currentNode.instrumentTypeByInstrumentType.name ? currentNode.instrumentTypeByInstrumentType.name : "instrument", "name": currentNode.name ? currentNode.name : "No Title", "actualname": currentNode.name ? currentNode.name : "No Title", "expanded": true, "icon": 4 };
      props.addNode(newNode)
    }
  }
  return (
    <Grid container spacing={0} >

      <Grid item xs={12} >
        <div style={{...classes.workArea,...(curTheme === 'dark' ? classes.workAreaBackground: {})}} id="workArea">
        {
          props.isEdit ? (<div style={{ display: 'inline-block', float: "right" }}>
            <div style={{paddingRight:"20px"}}>
            <NodeList addNode={addNode} value={NodeVal} />
            <AssetList addAsset={addAsset} />
            <InstrumentList addInstrument={addInstrument} />
            </div>
          </div>) : <React.Fragment></React.Fragment>
        }
        <HierarchyTree selectedIndex={props.selectedIndex} selectedNode={props.selectedNode} changeNode={props.changeDragNode} currentHier={props.currentHierarchy} isEdit={props.isEdit} addentity={[]} addinstrument={[]} handleNodeClick={props.handleNodeClick} removeNode={props.removeNode} />
        </div>
      </Grid>
       

    </Grid>
  )
}
export default HierarchyContent;
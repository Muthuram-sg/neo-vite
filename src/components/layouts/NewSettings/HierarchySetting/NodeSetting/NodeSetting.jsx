import React, { useRef } from 'react';
import NodeHeader from './NodeHeader';
import NodeContent from './NodeContent';

 
function NodeSetting(props){
  const nodeRef = useRef() 
  return(
    <React.Fragment>
    
    
      <div className='p-4  h-full bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-l border-Border-border-50 dark:border-Border-border-dark-50'  >
            <NodeHeader handleUpdateHierarchy={props.updateNode} handleCancelUpdateHierarchy={props.cancelNode} isEdit={props.isEdit}/> 
            <NodeContent 
              ref={nodeRef}
              selectedPath={props.selectedPath}
              selectedNode={props.selectedNode}
              updateNode={props.updateNode}
              actualname={props.selectedNode && props.selectedNode.actualname?props.selectedNode.actualname:""}
              subtype={props.selectedNode && props.selectedNode.subtype?props.selectedNode.subtype:""}
              subnodeType={props.selectedNode && props.selectedNode.subnodeType?props.selectedNode.subnodeType:"virtual"}
              nodeName={props.selectedNode && props.selectedNode.name?props.selectedNode.name:""}
              isEdit={props.isEdit}
              nodetype={props.selectedNode && props.selectedNode.type?props.selectedNode.type:""}
              nodeicon={props.selectedNode && props.selectedNode.icon?props.selectedNode.icon:""}
              subnode={props.selectedNode && props.selectedNode.subnode}
            />
          </div>
          </React.Fragment>
  )
}
export default NodeSetting;
import React from 'react';
import HierarchyHeader from './HierarchyHeader';
import HierarchyContent from './HierarchyContent';


export default function HierarchyView(props){ 
  
    return(
        <div   className={`${props.isEdit ? ' bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ' : 'bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'} p-4 min-h-[93vh] `}> 
              <HierarchyHeader  isEdit={props.isEdit} hierName={props.currentHier && props.currentHier.name?props.currentHier.name:""}/>
              <div style={{ padding: 0}}>
              <HierarchyContent selectedIndex={props.selectedIndex} selectedNode={props.selectedNode} addNode={props.addNewNode} changeDragNode={props.ChangeNode} removeNode={props.removeNode} handleNodeClick={props.handleNodeClick}  isEdit={props.isEdit} currentHierarchy={props.currentHier && props.currentHier.hierarchy?props.currentHier.hierarchy:[]}/>
              </div>

            </div>
    )
}

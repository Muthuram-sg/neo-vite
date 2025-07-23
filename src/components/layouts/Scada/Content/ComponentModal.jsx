import React, { useState, useEffect, useRef } from 'react'; 
import { useRecoilState } from 'recoil';
import { selectedNodeAtom, nodesAtom, themeMode } from "recoilStore/atoms";
 
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from 'components/Core/ButtonNDL';
import AccordianNDL2 from 'components/Core/Accordian/AccordianNDL2';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import Input from 'components/Core/InputFieldNDL';
import { categorizedComponentsData } from './Componentdata';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import Delete from 'assets/neo_icons/Menu/scada/defaulttoolbar/Delete.svg?react';
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL'; 
import useDeleteScadaImage from 'components/layouts/Scada/hooks/useDeleteScadaImage';
import configParam from "config"; 

const ComponentModal = ({ open, onClose,scadaImagesData,handleAddComponent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);
     const [nodes] = useRecoilState(nodesAtom);
    const searchInputRef = useRef(null);
    const [currTheme] = useRecoilState(themeMode)
    const [AllCategories,setAllCategories]= useState([]);
    const [LibraryNodes,setLibraryNodes] = useState([]);
    const { DeleteScadaImageLoading, DeleteScadaImageData, DeleteScadaImageError, getDeleteScadaImage } = useDeleteScadaImage();
    

    // Track modal open state
    useEffect(() => {
        if (open && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [open]); // Focus input when modal is opened 

    const [expandedAccordions, setExpandedAccordions] = useState({}); 

    useEffect(()=>{
        // console.log(scadaImagesData,"scadaImagesData")
        if(scadaImagesData){ 
            let customimg = []
            scadaImagesData.map(v=>{
                customimg.push({ id: v.id, name: v.image_name,  type: 'customNode',src: v.src ,img: v.image_name , styleType: 'component'})
            })
            // OverallComp[idx].components = customimg
            setLibraryNodes(customimg) 
        }
        
    },[scadaImagesData])

    useEffect(()=>{
        if(DeleteScadaImageData){
            if(DeleteScadaImageData.data){
                let OverallComp = [...AllCategories]
                let idx = AllCategories.findIndex(f=> f.category === "My Library")
                let customimg = OverallComp[idx].components 
                OverallComp[idx].components = customimg.filter(f=> f.id !== DeleteScadaImageData.img_id)
                setAllCategories(OverallComp)
                setSelectedNode(null);
            }
            // console.log(DeleteScadaImageData,"DeleteScadaImageData")
        }
        
    },[DeleteScadaImageData])

    useEffect(()=>{
        let OverallComp = [...categorizedComponentsData]
        OverallComp.push({
            category: "My Library",
            components: LibraryNodes
        })
        

        setAllCategories(OverallComp)
        
        setExpandedAccordions(Object.fromEntries(OverallComp.map((cat) => [cat.category, false])))
    },[LibraryNodes])

    const toggleAccordion = (category) => {
        let obj = {}
        Object.keys(expandedAccordions).map(k=>{
            if(category === k){
                obj[k] = !expandedAccordions[k] 
            }else{
                obj[k] = expandedAccordions[k] 
            } 
            
        })
        // console.log(expandedAccordions,category,"category",obj)
        setExpandedAccordions(obj);
    };
    // useEffect(()=>{console.log(expandedAccordions,"expandedAccordions")},[expandedAccordions])

    const handleSearchChange = (e) => {
        if(e.target.value){
            setExpandedAccordions(Object.fromEntries(AllCategories.map((cat) => [cat.category, true])))
        }else{
            setExpandedAccordions(Object.fromEntries(AllCategories.map((cat) => [cat.category, false])))
        }
        
        setSearchTerm(e.target.value)
    };
    //const filter with startwith text matches only
    // const filteredCategories = categorizedComponentsData
    // .map((category) => ({
    //     ...category,
    //     components: category.components.filter((component) =>
    //         component.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    //     ),
    // }));
    

    const calculateNewPosition = (existingNodes) => {
        const baseX = 50;
        const baseY = 50;
        const columnOffset = 150;
        const rowOffset = 120;
        const maxColumns = 5;
        const count = existingNodes.length;
        return {
            x: baseX + (count % maxColumns) * columnOffset,
            y: baseY + Math.floor(count / maxColumns) * rowOffset,
        };
    };

    // Function to generate a random position
    const getRandomPosition = (minX, maxX, minY, maxY) => {
        return {
          x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
          y: Math.floor(Math.random() * (maxY - minY + 1)) + minY,
        };
      };

    const handleComponent = () => {
        if (selectedNode) {
            const newPosition = calculateNewPosition(nodes);

            // let newPosition = getRandomPosition(50, 500, 50, 500)
            // console.log(newPosition,"newPositionnewPosition")
            let obj = selectedNode.icon ? {icon : selectedNode.icon} : {img : selectedNode.id}
            
            let newNode ={
                id: selectedNode.id+new Date().getTime(),
                type: selectedNode.type,
                selected: true,
                data: {
                    id: selectedNode.id,
                    label: selectedNode.name, 
                    style:{width: 80,height:80},
                    ...obj
                },
                position: newPosition,
                style:{width: 80,height:80}
            } 
            handleAddComponent(newNode)
            OnCancel()
        } else {
            console.log('No component selected');
        }
    };

    function OnCancel(){
        setSearchTerm('')
        setSelectedNode(null);
        onClose();
    }

    const handleNodeSelect = (node) => setSelectedNode(node);

    useEffect(() => {
        if (open && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [open]);

    const filteredCategories = AllCategories
        .map((category) => ({
            ...category,
            components: category.components.filter((component) =>
                component.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((category) => category.components.length > 0);

    function handleDeleteImg(e,val){ 
        getDeleteScadaImage({"image_name":val.name,"id":val.id})
        e.preventDefault();
        
    }

    return (
        <React.Fragment>
        {/* <Modal open={open} onCancel={OnCancel} width={1200}> */}
            <ModalHeaderNDL>
                <div className="flex">
                    <TypographyNDL variant="heading-02-s" value="Add Component" />
                </div>
            </ModalHeaderNDL>

            <ModalContentNDL>
                <div style={{ display: 'flex' }}>
                    <div className="px-2" style={{ width: '50%' }}>
                        <Input
                            autoComplete
                            autoFocus
                            id="search-components"
                            name="searchTerm"
                            placeholder={"Search Component"}
                            size="small"
                            value={searchTerm}
                            type="text"
                            onChange={handleSearchChange}
                            disableUnderline={true}
                            startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} />}
                            endAdornment={searchTerm !== '' ? <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} onClick={() => { handleSearchChange({target:{value:''}})}} /> : ''}
                            // endAdornment={searchTerm !== '' ? <Clear onClick={() => { setHomeSearchText('');setSearchText(''); setHomeInput(false) }} /> : ''}
                        />
                        <div className="mt-2" style={{ maxHeight: '400px', overflowY: 'auto', scrollBehavior: 'smooth' }}>
                            {filteredCategories.map((category) => (
                                <AccordianNDL2
                                    key={category.category}
                                    title={
                                        <span>
                                            {category.category}
                                            
                                            <span className='font-geist-mono'
                                                style={{
                                                    backgroundColor: '#f0f0f0',
                                                    borderRadius: '5px',
                                                    padding: '2px 5px',
                                                    fontWeight: '400',
                                                    marginLeft: '5px',
                                                  // fontFamily: 'monospace',
                                                }}
                                            >
                                                {/* <TypographyNDL variant="paragraph-s" type='mono' value={category.components.length} /> */}
                                                {category.components.length}
                                            </span>
                                        </span>
                                    }
                                    isexpanded={expandedAccordions[category.category]}
                                    managetoggle={() => toggleAccordion(category.category)}
                                    multiple={true}
                                >
                                    {expandedAccordions[category.category] && (
                                        <div>
                                            {category.components.length === 0 ? (
                                                <div>No components found</div>
                                            ) : (
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                                        gap: '16px',
                                                        padding: '10px',
                                                    }}
                                                >
                                                    {category.components.map((component) => {
                                                        const Icon = component.icon;
                                                        return (
                                                            <div
                                                                key={component.id}
                                                                onClick={() => handleNodeSelect(component)}
                                                                style={{
                                                                    padding: '10px',
                                                                    cursor: 'pointer',
                                                                    border:
                                                                        selectedNode?.id === component.id
                                                                            ? '1px solid #0090ff'
                                                                            : 'none',
                                                                    backgroundColor:
                                                                         '#f9f9f9'
                                                                            ,
                                                                    borderRadius: '8px',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {component.img ? 
                                                                <div>
                                                                    <div style={{float:'right',margin:'-10px'}}>
                                                                        <TooltipNDL title={"Remove"} placement="bottom" arrow   >
                                                                            <Button  icon={Delete} type='ghost' onClick={(e)=>handleDeleteImg(e,component)}  />
                                                                        </TooltipNDL>
                                                                    </div>
                                                                    <img style={{ marginBottom: '8px',height:'48px',width:'48px' }} src={component.src}/>
                                                                </div>
                                                                :
                                                                <Icon style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
                                                                }
                                                                
                                                                <div>
                                                                    <TypographyNDL variant="paragraph-xs" value={component.name} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </AccordianNDL2>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                        {selectedNode ? (
                            <div style={{ textAlign: 'center' }}>
                                {selectedNode.icon ?
                                    <selectedNode.icon style={{ width: '300px', height: '300px', marginTop: '10px' }} />
                                :
                                    <img width="300px" height="300px" style={{ marginTop: '10px' }} src={selectedNode.src}/>
                                }
                                <div className="py-4">
                                    <TypographyNDL variant="paragraph-s" color="secondary">
                                        {selectedNode.name} 
                                    </TypographyNDL>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <TypographyNDL variant="paragraph-s" color="secondary" value="Select a Component to Preview" />
                            </div>
                        )} 
                    </div>
                </div>
            </ModalContentNDL>

            <ModalFooterNDL>
                <Button onClick={OnCancel} type="secondary" value="Cancel" />
                <Button type="primary" value="Add" onClick={handleComponent} />
            </ModalFooterNDL>
        {/* </Modal> */}
        </React.Fragment>
    );
};

export default ComponentModal;

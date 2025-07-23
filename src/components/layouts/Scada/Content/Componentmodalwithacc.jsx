import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedNodeAtom, nodesAtom } from "recoilStore/atoms";
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from 'components/Core/ButtonNDL';
import AccordianNDL2 from 'components/Core/Accordian/AccordianNDL2';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import Input from 'components/Core/InputFieldNDL';
import { categorizedComponentsData } from './Componentdata';

// const ComponentModal = ({ open, onClose, onAddComponent }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);
//     const [nodes, setNodes] = useRecoilState(nodesAtom);

//     // Initialize expandedAccordions state dynamically based on categories
//     const [expandedAccordions, setExpandedAccordions] = useState(
//         Object.fromEntries(categorizedComponentsData.map((cat) => [cat.category, false]))
//     );

//     // Toggle accordion for a specific category
//     const toggleAccordion = (category) => {
//         setExpandedAccordions((prev) => ({
//             ...prev,
//             [category]: !prev[category],
//         }));
//     };

//     // Search handler
//     const handleSearchChange = (e) => setSearchTerm(e.target.value);

//     // Filter categories based on search term
//     const filteredCategories = categorizedComponentsData.map((category) => ({
//         ...category,
//         components: category.components.filter((component) =>
//             component.name.toLowerCase().includes(searchTerm.toLowerCase())
//         ),
//     }));

//     // Calculate a new position for added components
//     const calculateNewPosition = (existingNodes) => {
//         const baseX = 50;
//         const baseY = 50;
//         const columnOffset = 150;
//         const rowOffset = 120;
//         const maxColumns = 5;

//         const count = existingNodes.length;
//         return {
//             x: baseX + (count % maxColumns) * columnOffset,
//             y: baseY + Math.floor(count / maxColumns) * rowOffset,
//         };
//     };

//     // Handle adding a component
//     const handleAddComponent = () => {
//         if (selectedNode) {
//             console.log('Selected Node:', selectedNode);

//             const newPosition = calculateNewPosition(nodes);

//             setNodes((prevNodes) => [
//                 ...prevNodes,
//                 {
//                     id: selectedNode.id,
//                     type: selectedNode.type,
//                     data: {
//                         label: selectedNode.name,
//                         icon: selectedNode.icon,
//                     },
//                     position: newPosition,
//                 },
//             ]);

//             setSelectedNode(null);
//             onClose();
//         } else {
//             console.log('No component selected');
//         }
//     };

//     // Handle node selection
//     const handleNodeSelect = (node) => setSelectedNode(node);

//     // Function to update the position of a node when it is moved
//     const handleNodeDrag = (nodeId, newPosition) => {
//         setNodes((prevNodes) =>
//             prevNodes.map((node) =>
//                 node.id === nodeId ? { ...node, position: newPosition } : node
//             )
//         );
//     };


//     return (
//         <Modal open={open} onCancel={onClose}  width={1200}>
//             <TypographyNDL variant="heading-02-s" value="Add Component" />
//             <TypographyNDL variant="paragraph-xs" value="Personalize your factory's identity, location, and business hierarchy." />

//             <div style={{ display: 'flex', height: '70vh' }}>
//                 {/* Left Section */}
//                 <div style={{ width: '50%', padding: '10px' }}>
//                     <Input
//                         id="search-components"
//                         name="searchTerm"
//                         placeholder="Search components..."
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                     />
//                     <div className="mt-2" style={{ maxHeight: '60vh', overflowY: 'auto', scrollBehavior: 'smooth' }}>
//                         {filteredCategories.map((category) => (
//                             // <AccordianNDL2
//                             //     key={category.category}
//                             //     title={`${category.category} 0${category.components.length}`}
//                             //     isexpanded={expandedAccordions[category.category]}
//                             //     managetoggle={() => toggleAccordion(category.category)}
//                             //     multiple={true}
//                             // >
//                             //     {expandedAccordions[category.category] && (
//                             //         <div>
//                             //             {category.components.length === 0 ? (
//                             //                 <div>No components found</div>
//                             //             ) : (
//                             //                 <div
//                             //                     style={{
//                             //                         display: 'grid',
//                             //                         gridTemplateColumns: 'repeat(3, 1fr)',
//                             //                         gap: '16px',
//                             //                         padding: '10px',
//                             //                     }}
//                             //                 >
//                             //                     {category.components.map((component) => {
//                             //                         const Icon = component.icon;
//                             //                         return (
//                             //                             <div
//                             //                                 key={component.id}
//                             //                                 onClick={() => handleNodeSelect(component)}
//                             //                                 style={{
//                             //                                     padding: '10px',
//                             //                                     cursor: 'pointer',
//                             //                                     border:
//                             //                                         selectedNode?.id === component.id
//                             //                                             ? '1px solid #0090ff'
//                             //                                             : 'none',
//                             //                                     borderRadius: '8px',
//                             //                                     textAlign: 'center',
//                             //                                 }}
//                             //                             >
//                             //                                 <Icon style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
//                             //                                 <div>{component.name}</div>
//                             //                             </div>
//                             //                         );
//                             //                     })}
//                             //                 </div>
//                             //             )}
//                             //         </div>
//                             //     )}
//                             // </AccordianNDL2>

//                             <AccordianNDL2 
//     key={category.category}
//     title={
//         <span>
//             {category.category} 
//             <span
//                 style={{
//                     backgroundColor: '#f0f0f0',
//                     borderRadius: '5px',
//                     padding: '2px 5px',
                   
//                     fontWeight: 'bold',
//                     marginLeft: '5px'
//                 }}
//             >
//                 {category.components.length}
//             </span>
//         </span>
//     }
//     isexpanded={expandedAccordions[category.category]}
//     managetoggle={() => toggleAccordion(category.category)}
//     multiple={true}
// >
//     {expandedAccordions[category.category] && (
//         <div>
//             {category.components.length === 0 ? (
//                 <div>No components found</div>
//             ) : (
//                 <div
//                     style={{
//                         display: 'grid',
//                         gridTemplateColumns: 'repeat(3, 1fr)',
//                         gap: '16px',
//                         padding: '10px',
//                     }}
//                 >
//                     {category.components.map((component) => {
//                         const Icon = component.icon;
//                         return (
//                             <div
//                                 key={component.id}
//                                 onClick={() => handleNodeSelect(component)}
//                                 style={{
//                                     padding: '10px',
//                                     cursor: 'pointer',
//                                     border:
//                                         selectedNode?.id === component.id
//                                             ? '1px solid #0090ff'
//                                             : 'none',
//                                     borderRadius: '8px',
//                                     textAlign: 'center',
//                                 }}
//                             >
//                                 <Icon style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
//                                 <div>{component.name}</div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     )}
// </AccordianNDL2>


//                         ))}
//                     </div>
//                 </div>

//                 {/* Right Section */}
//                 <div style={{ width: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:'#e8e8e8', borderRadius:'5px'   }}>
//                     {selectedNode ? (
//                         <div style={{ textAlign: 'center' }}>
                            
//                             <selectedNode.icon style={{ width: '300px', height: '300px', marginTop: '10px' }} />
//                             <div>{selectedNode.name} Preview</div>
//                         </div>
//                     ) : (
//                         <div>Select a component to preview</div>
//                     )}
//                 </div>
//             </div>

//             {/* Footer */}
//             <ModalFooterNDL>
            
//                 <Button onClick={onClose} type="secondary" value="Cancel" />
//                 <Button type="primary" value="Add" onClick={handleAddComponent} />
          
//             </ModalFooterNDL>
//         </Modal>
//     );
// };

// export default ComponentModal;


const ComponentModal = ({ open, onClose, onAddComponent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);
    const [nodes, setNodes] = useRecoilState(nodesAtom);

    // Initialize expandedAccordions state dynamically based on categories
    const [expandedAccordions, setExpandedAccordions] = useState(
        Object.fromEntries(categorizedComponentsData.map((cat) => [cat.category, false]))
    );

    // Toggle accordion for a specific category
    const toggleAccordion = (category) => {
        setExpandedAccordions((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    // Search handler
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    // Filter categories based on search term
    const filteredCategories = categorizedComponentsData
        .map((category) => ({
            ...category,
            components: category.components.filter((component) =>
                component.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((category) => category.components.length > 0); // Filter out categories with no matching components

    // Calculate a new position for added components
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

    // Handle adding a component
    const handleAddComponent = () => {
        if (selectedNode) {
            console.log('Selected Node:', selectedNode);

            const newPosition = calculateNewPosition(nodes);

            setNodes((prevNodes) => [
                ...prevNodes,
                {
                    id: selectedNode.id,
                    type: selectedNode.type,
                    data: {
                        label: selectedNode.name,
                        icon: selectedNode.icon,
                    },
                    position: newPosition,
                },
            ]);

            setSelectedNode(null);
            onClose();
        } else {
            console.log('No component selected');
        }
    };

    // Handle node selection
    const handleNodeSelect = (node) => setSelectedNode(node);

    // Function to update the position of a node when it is moved
    const handleNodeDrag = (nodeId, newPosition) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId ? { ...node, position: newPosition } : node
            )
        );
    };

    return (
        <Modal open={open} onCancel={onClose}  width={1200}>
            <ModalHeaderNDL>
             <div className="flex">
            <TypographyNDL variant="heading-02-s" value="Add Component" />
            {/* <TypographyNDL variant="paragraph-xs" value="Personalize your factory's identity, location, and business hierarchy." /> */}
            </div>
            </ModalHeaderNDL>

             <ModalContentNDL>
            <div style={{ display: 'flex', height: '70vh' }}>
                {/* Left Section */}
                <div className="px-2" style={{ width: '50%'}}>
                    <Input
                        id="search-components"
                        name="searchTerm"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="mt-2" style={{ maxHeight: '60vh', overflowY: 'auto', scrollBehavior: 'smooth' }}>
                        {filteredCategories.map((category) => (
                            <AccordianNDL2 
                                key={category.category}
                                title={
                                    <span>
                                        {category.category} 
                                        <span
                                            style={{
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '5px',
                                                padding: '2px 5px',
                                                fontWeight: 'bold',
                                                marginLeft: '5px'
                                            }}
                                        >
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
                                                                borderRadius: '8px',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <Icon style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
                                                            <div>{component.name}</div>
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

                {/* Right Section */}
                <div style={{ width: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:'#e8e8e8', borderRadius:'5px' }}>
                    {selectedNode ? (
                        <div style={{ textAlign: 'center' }}>
                            <selectedNode.icon style={{ width: '300px', height: '300px', marginTop: '10px' }} />
                            <div>{selectedNode.name} Preview</div>
                        </div>
                    ) : (
                        <div>Select a component to preview</div>
                    )}
                </div>
            </div>
            </ModalContentNDL>

            {/* Footer */}
            <ModalFooterNDL>
                <Button onClick={onClose} type="secondary" value="Cancel" />
                <Button type="primary" value="Add" onClick={handleAddComponent} />
            </ModalFooterNDL>
        </Modal>
    );
};

export default ComponentModal;

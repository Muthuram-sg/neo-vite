import React, { useState, useImperativeHandle } from 'react';
import Input from 'components/Core/InputFieldNDL';
import AccordianNDL2 from 'components/Core/Accordian/AccordianNDL2';
import Button from 'components/Core/ButtonNDL';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import FeederIcon from 'assets/neo_icons/ScadaIcon/feeder.svg?react';
import MixerIcon from 'assets/neo_icons/ScadaIcon/mixer.svg?react';

const ComponentContent = React.forwardRef(({ expandedAccordions, searchTerm, toggleAccordion, handleSearchChange, onClose }, ref) => {
    const [selectedNode, setSelectedNode] = useState(null);

    // Expose methods to parent (ComponentModal)
    useImperativeHandle(ref, () => ({
        openContent: () => {
            console.log('Content opened!');
            // You can load or initialize things here when the modal is opened
        },
        closeContent: () => {
            console.log('Content closed!');
            // Reset states or cleanup if needed
        }
    }));

    const filteredCategories = [
        { category: 'Feeders', components: [{ id: 1, name: 'Feeder 1', icon: FeederIcon }] },
        { category: 'Mixers', components: [{ id: 2, name: 'Mixer 1', icon: MixerIcon }] }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '70vh' }}>
            <TypographyNDL variant="heading-02-s" value="Add Component" />
            <TypographyNDL variant="paragraph-xs" value="Personalize Your factory's identity, location, and business hierarchy" />

            {/* Left Section: Accordion with Search */}
            <div style={{ width: '50%', padding: '10px', borderRight: '1px solid #ddd' }}>
                <Input
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '10px' }}
                />
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {filteredCategories.map((category) => (
                        <AccordianNDL2
                            key={category.category}
                            title={category.category}
                            isexpanded={expandedAccordions[category.category] || false}
                            managetoggle={() => toggleAccordion(category.category)}
                            multiple={true}
                        >
                            {expandedAccordions[category.category] && (
                                <div>
                                    {category.components.map((component) => {
                                        const Icon = component.icon;
                                        return (
                                            <div
                                                key={component.id}
                                                style={{
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    border: '1px solid gray',
                                                    marginBottom: '5px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}
                                                onClick={() => setSelectedNode(component)}
                                            >
                                                <Icon style={{ width: '24px', height: '24px' }} />
                                                <span>{component.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </AccordianNDL2>
                    ))}
                </div>
            </div>

            {/* Right Section: Preview of Selected Node */}
            <div style={{ width: '50%', padding: '10px' }}>
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {selectedNode ? (
                        <div style={{ textAlign: 'center' }}>
                            <div>{selectedNode.name} Preview</div>
                            <selectedNode.icon style={{ width: '100px', height: '100px', marginTop: '20px' }} />
                        </div>
                    ) : (
                        <div>Select a component to preview</div>
                    )}
                </div>
            </div>

            {/* Footer: Cancel and Add Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onClose} type="secondary" value="Cancel" />
                <Button type="primary" value="Add" />
            </div>
        </div>
    );
});

export default ComponentContent;

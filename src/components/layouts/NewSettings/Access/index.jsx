import React, { useState, useEffect } from "react";

import useGetTheme from 'TailwindTheme';

import Typography from "components/Core/Typography/TypographyNDL";

import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";

import Button from "components/Core/ButtonNDL";

import Grid from "components/Core/GridNDL";

import HorizontalLineNDL from "components/Core/HorizontalLine/HorizontalLineNDL";

import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";

import useStandardDashboardList from "./hooks/useStandardDashboardList";

import useResetAccess from "./hooks/useResetAccess";

import useUpdateAccess from "./hooks/useUpdateAccess";
import useUpdateNotVisibleAccess from "./hooks/useUpdateNotVisibleAcess";

import { useRecoilState } from "recoil";

import { selectedPlant,snackMessage,snackType,snackToggle } from "recoilStore/atoms";

import ModalNDL from 'components/Core/ModalNDL';

import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';

import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';

import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";

export default function Users(props) {

    const [headPlant] = useRecoilState(selectedPlant)

    const theme = useGetTheme();

    const [page, setPage] = useState('Access')

    const [modalOpen, setModalOpen] = useState(false);

    const [cancelmodal, setcancelmodal] = useState(false);

    const [resetmodal, setresetmodal] = useState(false);

    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [isEditable, setIsEditable] = useState(false);
    const [updatedStates, setupdatedStates ] = useState([]);
    const [States, setStates] = useState([

        {

            module_id: 1,

            module_name: "Dashboard",

            sub_text: "Visualize real-time and historical data across all operations in a centralized view.",

            is_visible: false,

            submodules: [],

        },

        {

            module_id: 2,

            module_name: "Report",

            sub_text: "Generate customizable reports for deeper insights and data-driven decisions.",

            is_visible: false,

            submodules: [],

        },

        {

            module_id: 3,

            module_name: "Explore",

            sub_text: "Analyze historical trends and access detailed data records for performance tracking.",

            is_visible: false,

        },

        {

            module_id: 4,

            module_name: "Analytics",

            sub_text: "Dive into process analytics to identify patterns, optimize workflows, and improve efficiency.",

            is_visible: false,

        },

        {

            module_id: 5,

            module_name: "Neo AI",

            sub_text: "Interact with an intelligent chatbot to gain insights and answer queries on operational data.",

            is_visible: false,

        },

        {

            module_id: 6,

            module_name: "Tasks",

            sub_text: "Manage and assign tasks to streamline workflows and improve operational productivity.",

            is_visible: false,

        },

        {

            module_id: 7,

            module_name: "Production",

            sub_text: "Oversee product management, work orders, execution details, and reasons.",

            is_visible: false,

        },

        {

            module_id: 8,

            module_name: "Offline",

            sub_text: "Capture and enter data manually for instruments that occur outside connected systems.",

            is_visible: false,

        },

        {

            module_id: 9,

            module_name: "Alarms",

            sub_text: "Monitor and receive alerts for critical events to ensure timely responses to issues.",

            is_visible: false,

        },

        {

            module_id: 10,

            module_name: "Predictive Maintenance",

            sub_text: "Predict and prevent assets failures by analyzing health and faults data.",

            is_visible: false,

        },

    ]);







    const { StandardDashboardListLoading, StandardDashboardListData, StandardDashboardListError, GetStandardDashboardList } = useStandardDashboardList();

    const { ResetAccessLoading, ResetAccessData, ResetAccessError, UpdateModuleAndSubModuleVisibility } = useResetAccess();

    const { UpdateAccessLoading, UpdateAccessData, UpdateAccessError, updatedModuleAndSubModuleVisibility } = useUpdateAccess();
    const { UpdateAccessNotVisibleLoading, UpdateAccessNotVisibleData, UpdateAccessNotVisibleError, UpdatedModuleAndSubModuleNotVisibility } = useUpdateNotVisibleAccess();


    const handleOpenModal = () => setModalOpen(true);

    const handleCloseModal = () => setModalOpen(false);

    const handlecancelmodal = () => setcancelmodal(true);

    const handleCancelClosemodal = () => setcancelmodal(false);

    const handleresetmodal = () => setresetmodal(true);

    const handleresetClosemodal = () => setresetmodal(false);

    useEffect(() => {

        GetStandardDashboardList(headPlant.id);
    }, [headPlant.id]);

    useEffect(() => {
        if (headPlant?.appTypeByAppType?.id === 3) {
    
            setupdatedStates(States.map(module =>
                module.module_id === 5
                    ? { ...module, module_name: "CMS AI" }
                    : module
            ));
        } else {
            setupdatedStates(States); 
        }
    }, [States, headPlant]);

    useEffect(() => {

        if (!StandardDashboardListLoading && StandardDashboardListData && !StandardDashboardListError) {

            if (StandardDashboardListData.length > 0) {

                const filteredModules = StandardDashboardListData;
                let proceedData = [];

                filteredModules

                    .filter((module) =>

                        !['settings', 'support', 'profile'].includes(module.module_name.toLowerCase())

                    )

                    .sort((a, b) => {

                        const moduleA = parseInt(a.module_id, 10);

                        const moduleB = parseInt(b.module_id, 10);

                        return moduleA - moduleB;

                    })

                    .forEach((module) => {

                        const isModuleVisible = module.module_accesses.some((access) => access.is_visible);



                        let submodulesWithVisibility = module.sub_modules.map((subModule) => {

                            const isSubModuleVisible = subModule.sub_module_accesses.some(

                                (access) => access.is_visible

                            );

                            return { ...subModule, is_visible: isSubModuleVisible };

                        });



                        proceedData.push({

                            ...module,

                            is_visible: isModuleVisible,

                            short_text: module.short_text,

                            sub_modules: submodulesWithVisibility,

                        });

                    });


                setStates(proceedData);

                setPage("Access")

                setresetmodal(false)



            }

        }

    }, [StandardDashboardListLoading, StandardDashboardListData, StandardDashboardListError,]);



    const resetAllModules = () => {
        UpdateModuleAndSubModuleVisibility(headPlant.id);

    }

    const handleSnackBar  =(type,message) =>{
        SetType(type);SetMessage(message);setOpenSnack(true);
    }

    useEffect(() => {
        if (!ResetAccessLoading && ResetAccessData && !ResetAccessError) {
            if (Object.keys(ResetAccessData).length > 0) {
                handleSnackBar('info', 'Modules Reset Successfully');
                GetStandardDashboardList(headPlant.id);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
    }, [ResetAccessLoading, ResetAccessData, ResetAccessError, UpdateAccessData, headPlant.id]);
    


    const saveAllModules = async  () => {
    let nonVisibleModule=[];
    let visibleModule=[];
    let nonsubModuleId=[];
    let submoduleId=[];
    updatedStates.forEach(x => {
        if (x.is_visible) {
            visibleModule.push(x.module_id);
        } else {
            nonVisibleModule.push(x.module_id);
        }
    
        if (Array.isArray(x.sub_modules) && x.sub_modules.length) {
            x.sub_modules.forEach(y => {
                if (y.is_visible) {
                    submoduleId.push(y.sub_module_id);
                } else {
                    nonsubModuleId.push(y.sub_module_id);
                }
            });
        }
    });

    const promises = [];
   
        promises.push(
            updatedModuleAndSubModuleVisibility(
           headPlant.id,
           visibleModule,
           submoduleId
            )
        );

        promises.push(
            UpdatedModuleAndSubModuleNotVisibility(
                headPlant.id,
                nonVisibleModule,
                nonsubModuleId
            )
        );
    
    try {
        await Promise.all(promises);
       
    } catch (error) {
        console.error("Error updating modules:", error);
    } 
 
    };

    useEffect(() => {
        if (!UpdateAccessLoading && UpdateAccessData && !UpdateAccessError) {
            if (Object.keys(UpdateAccessData).length > 0) {

                handleSnackBar('success','Access Updated ');
                setTimeout(() => {
                    window.location.reload()
                }, [2000])

            }

        }

    }, [UpdateAccessLoading, UpdateAccessData, UpdateAccessError]);


    useEffect(() => {
        if (!UpdateAccessNotVisibleLoading && UpdateAccessNotVisibleData && !UpdateAccessNotVisibleError) {
            if (Object.keys(UpdateAccessNotVisibleData).length > 0) {
                handleSnackBar('success','Access Updated');
                setTimeout(() => {
                    window.location.reload()
                }, [2000])

            }

        }

    }, [UpdateAccessNotVisibleLoading, UpdateAccessNotVisibleData, UpdateAccessNotVisibleError]);

    const handleAccessEdit = () => {

        setPage("AccessForm");

        props.handleHide(true);

        setIsEditable(true);

    };



    const breadcrump = [{ id: 0, name: 'Settings' }, { id: 2, name: 'Edit Access' }]

    const handleActiveIndex = (index) => {

        if (index === 0) {

            setPage('Access')

            props.handleHide(false)

            setIsEditable(false);



        }



    }

    const handleExist = () => {
        setcancelmodal(false);
        setIsEditable(false)
        GetStandardDashboardList(headPlant.id);
        props.handleHide(false)

      
    }


    const handleToggle = (moduleId, currentVisibility) => {

        const updatedModules = updatedStates.map((module) => {
            if (module.module_id === moduleId) {
                return { ...module, is_visible: !currentVisibility };
            }
            return module;
        });
        setStates(updatedModules);
    };
    

   

    const handleToggleSubmodule = (subModuleId, currentVisibility, lineId, state) => {
        const updatedState = state.map((module) => {
            if (module.is_visible) {
                module.sub_modules = module.sub_modules.map((subModule) => {
                    if (subModule.sub_module_id === subModuleId) {
                        subModule.is_visible = !currentVisibility;
                        subModule.sub_module_accesses = subModule.sub_module_accesses.map((access) => {
                            if (access) {
                                access.is_visible = subModule.is_visible;
                            }
                            return access;
                        });
                    }
                    return subModule;
                });
            }
            return module;
        });

        setStates(updatedState)

    };

    return (

        <React.Fragment>

            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] px-4 py-2 flex justify-between items-center ' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>

                {

                    page === 'Access' ?

                        <React.Fragment>

                            <Typography value='Access' variant='heading-02-xs' />

                            <Button

                                type="ghost"

                                style={{ float: "right" }}

                                value={('Edit')} onClick={() => { handleAccessEdit() }}

                            // icon={Edit}

                            />

                        </React.Fragment>



                        :

                        <React.Fragment>

                            <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />

                            <div className="flex gap-2">

                                <Button

                                    type="ghost"

                                    value="Reset"

                                    onClick={() => handleresetmodal()}

                                />

                                <Button type="secondary" value={('Cancel')} onClick={() => handlecancelmodal()} />

                                <Button type="primary" value={('Save')} onClick={() => handleOpenModal()} />

                            </div>

                        </React.Fragment>

                }

            </div>

            <React.Fragment>

                {modalOpen && (

                    <ModalNDL open={modalOpen}  >

                        <ModalHeaderNDL >

                            <div className="flex flex-col items-start">

                                <Typography variant="heading-02-xs" value="Confirmation Required" />


                            </div>



                        </ModalHeaderNDL>



                        <ModalContentNDL  >

                            <Typography variant="paragraph-s" color="secondary" value="Are you sure you want to apply these changes to module access? This action may affect permissions and access to certain modules." />

                        </ModalContentNDL>



                        <ModalFooterNDL>

                            <Button type='secondary' value={("Cancel")} onClick={handleCloseModal} />

                            <Button type='primary' value={UpdateAccessNotVisibleLoading || UpdateAccessLoading ?("Loading...") : ("Confirm")} onClick={saveAllModules} />

                        </ModalFooterNDL>

                    </ModalNDL>

                )}



                {cancelmodal && (

                    <ModalNDL open={cancelmodal}  >

                        <ModalHeaderNDL >

                            <div className="flex flex-col items-start">

                                <Typography variant="heading-02-xs" value="Confirmation Required" />

                            </div>



                        </ModalHeaderNDL>



                        <ModalContentNDL  >

                            <Typography variant="paragraph-s" value="Are you sure you want to exit without saving your changes? Any unsaved changes will be lost." />

                        </ModalContentNDL>



                        <ModalFooterNDL>

                            <Button type='secondary' value={("Cancel")} onClick={handleCancelClosemodal} />

                            <Button type='primary' value={("Exit")} onClick={handleExist} />

                        </ModalFooterNDL>

                    </ModalNDL>

                )}



                {resetmodal && (

                    <ModalNDL open={resetmodal}  >

                        <ModalHeaderNDL >

                            <div className="flex flex-col items-start">

                                <Typography variant="heading-02-xs" value="Confirmation Required" />

                            </div>

                        </ModalHeaderNDL>

                        <ModalContentNDL  >

                            <Typography variant="paragraph-s"  color="secondary" value="Are you sure you want to reset? Resetting will discard all unsaved changes. This action cannot be undone. Do you want to proceed?" />

                        </ModalContentNDL>



                        <ModalFooterNDL>

                            <Button type='secondary' value={("Cancel")} onClick={handleresetClosemodal} />

                            <Button type='primary'  value={ResetAccessLoading  ?("...Loading") : ("Reset")}
                            
                             onClick={() => {
                                resetAllModules();

                            }} />

                        </ModalFooterNDL>

                    </ModalNDL>

                )}



                <Grid container className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark' style={{ height: 'calc(100vh - 48px)', overflowY: 'auto', padding: '16px' }}>
                    <Grid item xs={2}>
                    </Grid>

                    <Grid item xs={8}>

                        <React.Fragment>

                            <div className='mt-5' />

                            <Typography variant="heading-02-xs" value={"Module Access"} />

                            <Typography variant="paragraph-xs" color="tertiary" value={"Configure and manage module access for the plant"} />

                            <div className='mt-5'>

                                {updatedStates.length > 0 && updatedStates.map((x, i) => {

                                    return (

                                        <React.Fragment key={x.module_id}>

                                            <div className="flex justify-between items-start">

                                                <div>

                                                    <Typography variant="label-01-s" value={x.module_name} />

                                                    <Typography variant="paragraph-xs" color="tertiary" value={x.short_text} />

                                                </div>

                                                <div>

                                                    {/* Main Switch to control module visibility */}

                                                    <SwitchCustom

                                                        size="small"

                                                        switch={true}

                                                        checked={x.is_visible}

                                                        disabled={!isEditable}

                                                        onChange={() => handleToggle(x.module_id, x.is_visible
                                                        )}

                                                    />

                                                </div>

                                            </div>



                                            {/* Render submodules if the module is visible */}

                                            {x.is_visible && x.sub_modules && Array.isArray(x.sub_modules) && x.sub_modules.length > 0 &&

                                                x.sub_modules.map((subModule) => {

                                                    return (

                                                        <div key={subModule.sub_module_id}>

                                                            <SwitchCustom

                                                                size="small"

                                                                switch={false}

                                                                checked={subModule.is_visible}

                                                                disabled={!isEditable}

                                                                onChange={() => handleToggleSubmodule(subModule.sub_module_id, subModule.is_visible, headPlant.id, updatedStates)}

                                                                primaryLabel={subModule.sub_module_name}

                                                            />

                                                        </div>

                                                    );

                                                })

                                            }



                                            <div className='mt-5' />

                                            <HorizontalLineNDL variant="divider1" />

                                            <div className='mt-5' />

                                        </React.Fragment>

                                    );

                                })}


                            </div>

                        </React.Fragment>

                    </Grid>



                </Grid>



            </React.Fragment>

        </React.Fragment>



    );

}
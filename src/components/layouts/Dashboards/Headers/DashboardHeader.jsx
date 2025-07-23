/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import useGetTheme from 'TailwindTheme';
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useTranslation } from 'react-i18next';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import moment from 'moment';
// Components
import DateRange from './DateRange';
import DashboardSelectbox from './DashboardSelectbox';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import MaskedInput from "components/Core/MaskedInput/MaskedInputNDL";
import EditSetting from "../Content/EditSettings/ModelEditDash";
import DashboardForm from './DashboardModal'; 
import gqlQueries from "components/layouts/Queries"
import useGetOptixAssertOption from 'components/layouts/Reports/hooks/useGetOptixAssertOption';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import ClickAwayListener from "react-click-away-listener"
import NewReport from 'assets/neo_icons/Menu/plus.svg?react';




// Recoil packages
import { useRecoilState } from 'recoil';
import {
    selectedPlant, user, currentDashboard, dashboardEditMode, FullScreenmode, ProgressLoad, CategoryGroup, EnergyRange,
    currentDashboardSkeleton, defaultDashboard, playOption, oeeAssets, showOEEAsset, energyTab, averageType, dashboardHideGap,
    WaterfallNodes,
    ActivityNodes,
    ProductYear,
    ActivityYear,
    ProductNames,
    ActivityProductNames,
    EnergyProductNames,
    executionData,
    executionDetails,
    snackToggle,
    snackMessage,
    snackType,
    resources,
    energytype,
    SQMTRange,
    ActivityWise,
    CMSDashboardRange,
    ConnectivityLoading,
    prodsqmtloading,
    selectedContract,
    ContractDashboardRange,
    lineEntity,
    goLiveData,
    customdates,
    SelectedWOExe,
    ErrorPage,
    EnableRearrange,
    
    defectAnalyticsoptixOptions,
    SelectedDashboardPage,
    DashBoardHeaderFilter,
    themeMode,
    faultRange
} from "recoilStore/atoms"; // Recoil variables 
// Core Components    
import ButtonNDL from 'components/Core/ButtonNDL';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import { useParams } from "react-router-dom";

import ViewDay from 'assets/neo_icons/Menu/view_day.svg?react';
import Plus from 'assets/neo_icons/Menu/add.svg?react';
import FullScreenLight from 'assets/neo_icons/Menu/fullscreen.svg?react';
import ExitFullScreenLight from 'assets/neo_icons/Menu/exit_fullscreen.svg?react';
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import Play from 'assets/neo_icons/Menu/play.svg?react';
import Pause from 'assets/neo_icons/Menu/pause_dark.svg?react';
import AlarmIcon from 'assets/neo_icons/Menu/Alarm trend.svg?react';
import MapIcon from 'assets/neo_icons/Menu/location.svg?react';
import AreaLight from 'assets/neo_icons/Charts/area_chart.svg?react';
import BarLight from 'assets/neo_icons/Charts/bar_graph.svg?react';
import DonutLight from 'assets/neo_icons/Charts/donut_chart.svg?react';
import LineLight from 'assets/neo_icons/Charts/line_chart.svg?react';
import GaugeLight from 'assets/neo_icons/Equipments/gauge.svg?react';
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import EditIcon from 'assets/neo_icons/Dashboard/Edit.svg?react';
import useUpdateDashData from '../hooks/useUpdateDashData.jsx';
import useUpdateDashLayout from '../hooks/useUpdateDashLayout.jsx';
import Search from 'assets/neo_icons/Menu/newTableIcons/search_table.svg?react';
import UseProducts from "components/layouts/Settings/Production/Product/hooks/useProducts";
import LoadingScreenNDL from 'LoadingScreenNDL';
import useInstrumentType from "Hooks/useInstrumentType";
import useGetContractEntity from '../Content/standard/PowerDeliveryMonitoring/hooks/useGetContractEntity';
import ProgressIndicator from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Typography from 'components/Core/Typography/TypographyNDL';
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useCreateDashboard from '../hooks/useAddDashboard';
import useAlertList from 'components/layouts/Dashboards/Content/standard/hooks/useAlertList'
import configParam from "../../../../config";


function DashboardHeader(props) {
    // state variables
    const mainTheme = useGetTheme();
    const theme = useGetTheme();
    const [currTheme]= useRecoilState(themeMode)
    const [, setEnableRearrange] = useRecoilState(EnableRearrange)
    const [headPlant] = useRecoilState(selectedPlant);
    const [oeeAssetsArray, setOEEAssets] = useRecoilState(oeeAssets);
    const [ProgressBar] = useRecoilState(ProgressLoad);
    const [tabValue] = useRecoilState(energyTab);
    const [AssetOption, setAssetOption] = useState([]);
    const [selectedOEEAsset, setSelectedOEEAsset] = useRecoilState(showOEEAsset);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [currUser] = useRecoilState(user);
    const [selectedDashboard, setselectedDashboard] = useRecoilState(currentDashboard);
    const [editMode, setEditMode] = useRecoilState(dashboardEditMode);
    const [isFullScreen, setFullScreen] = useRecoilState(FullScreenmode);
    const [dashboardDefaultID] = useRecoilState(defaultDashboard);
    const [PlayMode, setPlayMode] = useRecoilState(playOption);
    const [openGap, setOpenGap] = useState(false);
    const [openCharts, setopenCharts] = useState(false);
    const [AnchorPos, setAnchorPos] = useState(null);
    const [averagetype, setaveragetype] = useRecoilState(averageType)
    const [category, setcategory] = useRecoilState(CategoryGroup)
    const [products, setProducts] = useState([])
    const [nodes, setnodes] = useState([])
    const [energyrange, setEnergyrange] = useRecoilState(EnergyRange)
    const { outGPLoading, outGPData, outGPError, getProduct } = UseProducts()
    const [SelectedDashboard, setSelectedDashboardSkeleton] = useRecoilState(currentDashboardSkeleton);
    const [input, setInput] = useState(false);
    const [, setErrorPage] = useRecoilState(ErrorPage);
    const [editAccess, setEditAccess] = useState(false);
    const [hideGap, setHideGap] = useRecoilState(dashboardHideGap);
    const [, setFaultRange] = useRecoilState(faultRange);
    const { UpdateDashDataLoading, UpdateDashDataData, UpdateDashDataError, getUpdateDashData } = useUpdateDashData();
    const { UpdateDashLayoutLoading, UpdateDashLayoutData, UpdateDashLayoutError, getUpdateDashLayout } = useUpdateDashLayout();
    const { EntityListLoading, EntityListData, EntityListError, getEntityList } = useGetContractEntity()
    const { t } = useTranslation();
    const [FilteredProducts, setFilteredProducts] = useState([])
    const [waterfallnodenames, setwaterfallnodenames] = useRecoilState(WaterfallNodes)
    const [activitynodenames, setactivitynodenames] = useRecoilState(ActivityNodes)
    const [productyear, setproductyear] = useRecoilState(ProductYear)
    const [activityyear, setactivityyear] = useRecoilState(ActivityYear)
    const [productprodnames, setproductprodnames] = useRecoilState(ProductNames)
    const [activityprodnames, setactivityprodnames] = useRecoilState(ActivityProductNames)
    const [energyprodnames, setenergyprodnames] = useRecoilState(EnergyProductNames)
    const [executionList] = useRecoilState(executionData);
    const [workExecutionID, setWorkExecutionDetails] = useRecoilState(executionDetails)
    const [WorkOrderExeCutionList] = useRecoilState(SelectedWOExe)
    const [, setIsDryer] = useState(false);
    const [resourcelist] = useRecoilState(resources)
    const [energytypes, setenergytypes] = useState([])
    const [selectedenergytype, setselectedenergytype] = useRecoilState(energytype)
    const [connectivityloading] = useRecoilState(ConnectivityLoading)
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType()
    const [offlineTypesData, setOfflineTypesData] = useState([]);
    const [selectedOfflineType, setSelectedOfflineType] = useState([]);
    const [selectedContracts, setselectedContract] = useRecoilState(selectedContract)
    const [ContractEntityList, setContractEntityList] = useState([])
    const [contractOption, setcontractOption] = useState([])
    const [CmsDashboardRange, setCmsDashboardRange] = useRecoilState(CMSDashboardRange);
    const [contractDashboardRange, setContractDashboardRange] = useRecoilState(ContractDashboardRange);
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const [UserOption, setUserOption] = useState([])
    const ActivityOption = [{ id: 1, name: "Production", checked: true }, { id: 2, name: "Adjustment", checked: true }, { id: 3, name: "Downtime", checked: true }]
    const [ActivityValue, setActivityValue] = useRecoilState(ActivityWise)
    const [ProdSqmtRange, setProdSqmtRange] = useRecoilState(SQMTRange);
    const [ProductOption, setProductOption] = useState([])
    const [AlertList, setAlertList] = useState([])
    const [productsqmttabloading] = useRecoilState(prodsqmtloading)
    const [entity] = useRecoilState(lineEntity);
    const [live, setLive] = useRecoilState(goLiveData);
    const daterangeRef = useRef();
    const [selectedDashboardPage] = useRecoilState(SelectedDashboardPage)
    const [DashboardFilters,setDashboardFilters] = useRecoilState(DashBoardHeaderFilter)
    
    

  
    const [isCustomInterval, setisCustomInterval] = useState(false)
    const intervalRef = useRef()
    const [EditInterval, setEditInterval] = useState('')
 
    const [ExecutionOption, setExecutionOption] = useState([]);
    const [optixAssert, setOptixAssert] = useRecoilState(defectAnalyticsoptixOptions)
    const [OptixAssetoption,setOptixAssetoption] = useState([])
    const { alertlistLoading, alertlistdata, alertlisterror, getAlertList } = useAlertList();



    const menuOption = [
        { id: "showGap", name: "Show Gap", stroke: mainTheme.colorPalette.primary, toggle: true, checked: hideGap },
        { id: "duplicate", name: "Duplicate", stroke: mainTheme.colorPalette.primary, toggle: false },
        { id: "edit", name: "Edit Dashboard", stroke: mainTheme.colorPalette.primary, icon: EditIcon, toggle: false, color: "#0F6FFF", RightIcon: true },

    ]
    let { moduleName, subModule1, queryParam } = useParams()
  

    const DateArray = subModule1 ? subModule1.split('&') : [];
    const DateParams = {};

    // Iterate over the array and split each key-value pair
    DateArray.forEach(param => {
        const [key, value] = param.split('=');
        DateParams[key] = value;
    });

    // Extracting the respective values
    const Defaultrange = DateParams['range'];
    const [AssetParam] = useState('')
    const [RangeParam, setRangeParam] = useState(Defaultrange)
    const [GroupParam, setGroupParam] = useState('')
   
    const [ProductParam, setProductParam] = useState('')
    const [NodesParam, setNodesParam] = useState('')
  
    const [, setDateParam] = useState('')
    const [, setDateToCompareParam] = useState('')
    const [, setYearParam] = useState('')
    const [menuOptions, setmenuOptions] = useState(menuOption)
    const editRef = useRef();
    const selectRef = useRef();
    const duplicateFormRef = useRef()
    const { CreateDashboardLoading, CreateDashboardData, CreateDashboardError } = useCreateDashboard();
    const { GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError, getGetOptixAssertOption } = useGetOptixAssertOption()


    const classes = {

        maskedInput: {
            fontSize: "14px",
            // width: "90px",
            fontFamily: "Inter",
            fontWeight: "400",
            padding: "6px 0px 6px 6px",
            width: "95%",
            border: "2px solid " + theme.colorPalette.backGround,
            borderRadius: "4px",
            margin: "0",
            display: "block",
            minWidth: "0",
            background: theme.colorPalette.backGround,
            boxSizing: "content-box",
            "&:focus": {
                border: "2px solid " + theme.colorPalette.blue,
                background: theme.palette.background.default,
            },
            "&:focus-visible": {
                outline: "none",
            },
            "&:active": {
                border: "2px solid " + theme.colorPalette.blue,
                background: theme.palette.background.default,
            }
        },

    }

    function getOEEAssets() {
        configParam.RUN_GQL_API(gqlQueries.getAssetOEEConfigs, { line_id: headPlant.id })
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_asset_oee_config && oeeData.neo_skeleton_prod_asset_oee_config.length > 0) {
                    setOEEAssets(oeeData.neo_skeleton_prod_asset_oee_config)
                } else {
                    setOEEAssets([])
                }
            });
    }

    useEffect(() => {
        getOEEAssets()
    }, [])

    useEffect(() => {
        if (!GetOptixAssertOptionLoading && GetOptixAssertOptionData && !GetOptixAssertOptionError) {
            //   setOptixAssert(GetOptixAssertOptionData)
            setOptixAssetoption(GetOptixAssertOptionData
            )

        }

    }, [GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError])

    useEffect(() => {
        getGetOptixAssertOption(21, headPlant.id)
    }, [headPlant.id])

    const handleOptixAssertChange = (e, option) => {
        // setselectedOptixAssert(e.target.value)
        // setOptixAssert(OptixAssertOption.filter(x => x.id === e.target.value))
        setOptixAssert({
            option: option.filter(x => x.id === e.target.value),
            value: e.target.value
        })
    }
    setFaultRange(14)
    useEffect(() => {
        if (ExecutionOption.length > 0) {
            // setWorkExecutionID(ExecutionOption.filter(f=> f.id === WorkOrderExeCutionList.id))
            setWorkExecutionDetails(ExecutionOption.filter(f => f?.id === WorkOrderExeCutionList?.id))
        }
        // console.log(WorkOrderExeCutionList,"WorkOrderExeCutionList",ExecutionOption)
    }, [ExecutionOption])

    useEffect(() => {

        if (executionList.length > 0) {


            setExecutionOption(executionList)
            if ((executionList[0]?.ended_at === null) && !WorkOrderExeCutionList?.WOrder) {
              
                setWorkExecutionDetails([executionList[0]])
            }

        } else {

            setWorkExecutionDetails([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executionList])
    function secondsToTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0'); // Ensure two digits for minutes
        const formattedSeconds = String(seconds).padStart(2, '0'); // Ensure two digits for seconds

        return `${formattedMinutes}:${formattedSeconds}`;
    }
    // console.log(RangeParam, "RangeParam")
    const enableEditMode = () => {
        setEditMode(true)
        if (PlayMode) {
            setPlayMode(false)
        }
        setisCustomInterval(selectedDashboard[0].dashboard.isCustomInterval)
        let reverse = secondsToTime(selectedDashboard[0].dashboard.interval)
        setEditInterval(reverse)
    }
    const cancelEditMode = () => {
        setSelectedDashboardSkeleton(JSON.parse(localStorage.getItem('actual_layout')))
        setEditMode(false)
        props.handleModal(false)
        props.refresh(true)
    }


    // useEffect(() => {
    //     getOEEAssets(headPlant.id)
    // }, [])


    useEffect(() => {
        // alert(localStorage.getItem('customDashboard') === '6')
    }, [customdates])

    useEffect(() => {
        if (!UpdateDashDataLoading && UpdateDashDataData && !UpdateDashDataError) {
            let currentDashboard = [];
            UpdateDashDataData.returning.forEach(item => {
                if (item.dashboard) {
                    currentDashboard.push(item.dashboard);
                }

            });
            let updatedDashboard = selectedDashboard.map(x => {
                return { ...x, dashboard: currentDashboard[0] }
            })
            // console.log(selectedDashboard,"selectedDashboard",updatedDashboard)
                setselectedDashboard(updatedDashboard)
        }

    }, [UpdateDashDataLoading, UpdateDashDataData, UpdateDashDataError])



    useEffect(() => {
        // setWorkExecutionDetails([])
        if (!alertlistLoading && !alertlisterror && alertlistdata) {
            // console.log(alertlistdata,"alertlistdataalertlistdata")
            setAlertList(alertlistdata)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertlistdata])
    useEffect(() => {
        if (headPlant.node && headPlant.node.nodes) {
            let configuredtypes = (headPlant.node.nodes.filter(m => m.type).filter(n => n.type === 1 || n.checked).map(f => f.type))
         
            setenergytypes(resourcelist.filter(r => configuredtypes.findIndex(c => c === r.id) >= 0))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id, resourcelist])
    //console.log(dashboardDefaultID, headPlant,headPlant.node.energy_contract,"page contract")
    useEffect(() => {
        if (!EntityListLoading && EntityListData && !EntityListError) {
            setContractEntityList(EntityListData)

        }
    }, [EntityListLoading, EntityListData, EntityListError])
    useEffect(() => {
        if (headPlant?.node?.energy_contract?.contracts?.length > 0) {

            if (ContractEntityList.length > 0) {
                const contractMerged = headPlant.node.energy_contract.contracts.map(cont => {
                    const contFilt = ContractEntityList.filter(ent => ent.id === cont.contract);
                    let contractInfo = entity.filter(y => y.id === cont.contract).length > 0 ? entity.filter(y => y.id === cont.contract)[0].info : {};
          
                    return { ...cont, ...contFilt[0], ...{ contractInfo: contractInfo } };
                })
       
                setcontractOption(contractMerged)

                setselectedContract(contractMerged);
            }

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id, ContractEntityList])
    useEffect(() => {


        let astArry = []
        // eslint-disable-next-line array-callback-return
        oeeAssetsArray.forEach(val => {
            //   console.log("Processing asset:", val); 
            if(dashboardDefaultID === '8c1bf778-c689-4bd4-a577-8008eb3a0547'){
                if(val?.entity?.dryer_config?.is_enable === true){
                    astArry.push({
                        id: val.entity.id,
                        name: val.entity.name,
                    })
                }
            }
            else {
                if(val?.entity?.dryer_config === null){
                    astArry.push({
                        id: val.entity.id,
                        name: val.entity.name,
                    })
                }
            }
        })
    

        setAssetOption(astArry)
        if (moduleName === 'production' && subModule1 && (subModule1.includes('=') || subModule1.includes('&')) && oeeAssetsArray.length) {
          
            const paramsArray = subModule1.split('&');

            const queryParams = {};

            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const asset = queryParams['asset'];
            const range = queryParams['range'];
            let EntArr = astArry.filter(x => x.id === asset);
            // console.log(asset, "asset", EntArr)
            if (asset && range && EntArr.length > 0) {

                if (asset) {
                    setSelectedOEEAsset({ show: true, id: asset })
                }
                setRangeParam(range)

            } else if(range){
                setRangeParam(range)
            }else {
                setErrorPage(true)
            }
        }
        // setSelectedOEEAsset({ show: true, id: localStorage.getItem('assetSelected') })

        if (localStorage.getItem("currCategoryValue") && !GroupParam) {
            setcategory(Number(localStorage.getItem("currCategoryValue")))
        }

        if (dashboardDefaultID === "00e6ca54-8a94-414a-80e4-69cd3752647c") {
            getInstrumentType(3) // Category is Health (id --3)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oeeAssetsArray, dashboardDefaultID, GroupParam])

    useEffect(() => {
        if (!InstrumentTypeListLoading && InstrumentTypeListData && !InstrumentTypeListError) {
            setOfflineTypesData(InstrumentTypeListData)
            setSelectedOfflineType(InstrumentTypeListData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [InstrumentTypeListData])



    const handleChangeOfflineType = (event) => {
        setSelectedOfflineType(event);
    }

    const handleContractChange = (e) => {
        setselectedContract(e)
    }
    useEffect(() => {
        let offlineTypeArr = selectedOfflineType.map((x) => x.id)
        props.getSelectedOfflineType(offlineTypeArr);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOfflineType])


    //Energy Dashboard Integration
    // console.log(moduleName,range,asset,"module name")
    // console.log(date,dateToCompare,"check dates")
    useEffect(() => {
        // console.log(moduleName,subModule1,"module name")
        let standardDash = ['BI', 'Electricity Price', 'Co2 Emission', 'Energy Consumption', 'oee', 'production', 'contract', 'cms', 'energy', 'custom', 'connectivity', 'dryer']
        let submoduleArr = ['co2', 'oee', 'execution', 'Parts', 'Tasks', 'water', 'Gas', 'energy', 'energy Price', 'Connectivity', 'Data Alerts']
        if (moduleName === 'energy' && subModule1 === 'energy' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const price = queryParams['price'];
            const range = queryParams['range'];
            if (range) {
                setRangeParam(range)
            } else {
                setErrorPage(true)
            }
            if (price) {
                //  setPriceParam(price)
                if (price === 'electricity unit price') {
                    setselectedenergytype(1)
                }
                else if (price === 'water price') {
                    setselectedenergytype(2)
                }
                else if (price === 'lpg gas price') {
                    setselectedenergytype(3)
                }
                else if (price === 'cng gas price') {
                    setselectedenergytype(4)
                } else {
                    setErrorPage(true)
                }
            } else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'energy' && subModule1 === 'parallel consumption' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const group = queryParams['group'];

            if (group) {
                setGroupParam(group)
                if (group === 'hourly') { 
                    setcategory(1)
                }
                else if (group === 'daily') {
                    setcategory(2)
                }
                else if (group === 'weekly') {
                    setcategory(3)
                }
                else if (group === 'monthly') {
                    setcategory(4)
                } else {
                    setErrorPage(true)
                }
            } else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'energy' && subModule1 === 'energy sqmt' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const range = queryParams['range'];
            const target = queryParams['target'];
            if (range) {
                setRangeParam(range)
            } else {
                setErrorPage(true)
            }
            if (target) {

                if (target === 'auto expected') {
                    setaveragetype(1)
                }
                else if (target === 'manual expected') {
                    setaveragetype(2)
                }

            } else {
                setErrorPage(true)
            }
        }
        else if (moduleName === 'custom' && subModule1 && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const refresh = queryParams['refresh'];
            const range = queryParams['range'];

            if (refresh && range) {


                setRangeParam(range)



                //setRefreshParam(refresh)
                daterangeRef && daterangeRef.current && daterangeRef.current.refreshDate();
                setPlayMode(false)
            } else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'contract' && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = subModule1.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const range = queryParams['range'];
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(range)) {
                // console.log(range, "range")
                // setRangeParam(range)

                setContractDashboardRange({
                    start: new Date(new Date(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').setMonth(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').getMonth())).toString())
                    , end: new Date(new Date(range.split(';')[1].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[1].split(' ')[1] + '+05:30').toString())
                })

                // console.log("setContractDashboardRange",{start:new Date(new Date(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').setMonth(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').getMonth())).toString())
                // ,end:new Date(new Date(range.split(';')[1].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[1].split(' ')[1] + '+05:30').toString())})
            }
            else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'cms' && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = subModule1.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const range = queryParams['range'];
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(range)) {
                // console.log(range, "range")
                setRangeParam(range)
                setCmsDashboardRange({
                    start: new Date(new Date(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').setMonth(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').getMonth() - 3)).toString())
                    , end: new Date(new Date(range.split(';')[1].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[1].split(' ')[1] + '+05:30').toString())
                })
            }
            else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'energy' && subModule1 === 'product sqmt' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const range = queryParams['range'];
        

            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(range)) {
              
                setProdSqmtRange({
                    start: new Date(new Date(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').setMonth(new Date(range.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[0].split(' ')[1] + '+05:30').getMonth() - 1)).toString())
                    , end: new Date(new Date(range.split(';')[1].split(' ')[0].split('-').reverse().join('-') + 'T' + range.split(';')[1].split(' ')[1] + '+05:30').toString())
                })
            }
            else {
                setErrorPage(true)
            }


        }
        else if (moduleName === 'energy' && subModule1 === 'waterfall' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const date = queryParams['date'];
            const dateToCompare = queryParams['date to compare'];
            if ((/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(date)) && (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(dateToCompare))) {
                setDateParam(date)
                setDateToCompareParam(dateToCompare)
                // console.log({ date: new Date(date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3')), compare: new Date(dateToCompare.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3')) }, "Date")
                setEnergyrange({ date: new Date(date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3')), compare: new Date(dateToCompare.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3')) })
            }
            else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'energy' && subModule1 === 'activity' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const year = queryParams['year'];

            // console.log(year, "year and range")
            if (/^'?\d{4}'?$/.test(year)) {
                setYearParam(year)
                setactivityyear(Number(year))
            }
            else {
                setErrorPage(true)
            }

        }
        else if (moduleName === 'oee' && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = subModule1.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const range = queryParams['range'];
            if (range) {
                setRangeParam(range)
            } else {
                setErrorPage(true)
            }
        }
        else if (moduleName && !standardDash.includes(moduleName)) {
            // setErrorPage(true)
        }else if (moduleName === 'custom' && subModule1) {
            // to custom Dashboard
            
        }
        else if (standardDash.includes(moduleName) && subModule1 && !(subModule1.includes('=') || subModule1.includes('&')) && !submoduleArr.includes(subModule1)) {
            setErrorPage(true)
        }
        getProduct()
        getEntityList(headPlant.id)
        getUsersListForLine(headPlant.id)
        getAlertList(headPlant.id)


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant, moduleName, AssetParam, queryParam, subModule1])
    // console.log(queryParam, moduleName, subModule1, "checkk")
    useEffect(() => {
        if (moduleName === 'energy' && (subModule1 === 'product sqmt' || subModule1 === 'energy sqmt' || subModule1 === 'activity') && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const product = queryParams['product'];

            if (product) {
                // console.log(product, "product")
                setProductParam(product)
            } else {
                setErrorPage(true)
            }
        }
        if ((!outGPError && !outGPLoading && outGPData)) {
            setProducts(outGPData)

            if (moduleName === 'energy' && (subModule1 === 'product sqmt' || subModule1 === 'energy sqmt' || subModule1 === 'activity')) {
                if (ProductParam === 'all') {
                    setproductprodnames(
                        outGPData.map(prod => ({
                            id: prod.id,
                            name: prod.name,
                            expected_energy: prod.expected_energy
                        }))
                    );
                    setactivityprodnames(
                        outGPData.map(prod => ({
                            id: prod.id,
                            name: prod.name,
                            expected_energy: prod.expected_energy
                        }))
                    );
                    setenergyprodnames(
                        outGPData.map(prod => ({
                            id: prod.id,
                            name: prod.name,
                            expected_energy: prod.expected_energy
                        }))
                    );
                } else {
                    let prodArr = ProductParam.split(',')

                    const filteredProducts = outGPData.filter(prod => prodArr.includes(prod.name));

                    if (filteredProducts.length > 0) {
                        setFilteredProducts(filteredProducts)
                        setproductprodnames(
                            filteredProducts.map(prod => ({
                                id: prod.id,
                                name: prod.name,
                                expected_energy: prod.expected_energy
                            }))
                        );
                        setactivityprodnames(
                            filteredProducts.map(prod => ({
                                id: prod.id,
                                name: prod.name,
                                expected_energy: prod.expected_energy
                            }))
                        );
                        setenergyprodnames(
                            filteredProducts.map(prod => ({
                                id: prod.id,
                                name: prod.name,
                                expected_energy: prod.expected_energy
                            }))
                        );
                    } else {
                        setErrorPage(true)
                    }

                }

            }
            else {
                if (outGPData.length > 0) {
                    setproductprodnames([{ "id": outGPData[0].id, "name": outGPData[0].name, "expected_energy": outGPData[0].expected_energy }])
                    setactivityprodnames([{ "id": outGPData[0].id, "name": outGPData[0].name, "expected_energy": outGPData[0].expected_energy }])
                    setenergyprodnames([{ "id": outGPData[0].id, "name": outGPData[0].name, "expected_energy": outGPData[0].expected_energy }])
                }
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGPLoading, outGPData, outGPError, moduleName, subModule1, queryParam, ProductParam])
    useEffect(() => {
        if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
            let userOption = []
            userOption = UsersListForLineData.map(x => {
                let id = x.user_id
                let format = x.userByUserId.name + " (" + x.userByUserId.sgid + ")"
                return Object.assign(x, { "id": id, "name": format });
            })
            // console.log(userOption,"userOption")
            setUserOption(userOption)
        }
    }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError])

    useEffect(() => {
        // console.log(headPlant,"headPlantheadPlant")

        if (headPlant.node && headPlant.node.product_energy) {
            if (headPlant.node.product_energy.primary === 2) {
                let Prodarr = []
                let arr = []
                if (headPlant.node.product_energy.prod_type === 1) {
                    Prodarr = products.filter(f => f.info && f.info.Tint).map((x, i) => { return { id: i + 1, name: x.info.Tint } })
                    arr = Prodarr.filter((obj, i) => i === Prodarr.findIndex(o => o.name === obj.name))

                } else if (headPlant.node.product_energy.prod_type === 3) {
                    Prodarr = products.filter(f => f.info && f.info.Family).map((x, i) => { return { id: i + 1, name: x.info.Family } })
                    arr = Prodarr.filter((obj, i) => i === Prodarr.findIndex(o => o.name === obj.name))
                } else if (headPlant.node.product_energy.prod_type === 2) {
                    Prodarr = products.filter(f => f.info && f.info.Thickness).map((x, i) => { return { id: i + 1, name: x.info.Thickness } })
                    arr = Prodarr.filter((obj, i) => i === Prodarr.findIndex(o => o.name === obj.name))
                }

                setProductOption(arr)
                if (arr.length > 0) {
                    if (FilteredProducts) {
                        setproductprodnames(
                            FilteredProducts.map(prod => ({
                                id: prod.id,
                                name: prod.name,
                                expected_energy: prod.expected_energy
                            }))
                        );
                    }
                    else {
                        setproductprodnames([{ "id": arr[0].id, "name": arr[0].name }])
                    }

                }

            } else {
                setProductOption(products)
                if (products.length > 0) {
                    if (FilteredProducts) {
                        setproductprodnames(
                            FilteredProducts.map(prod => ({
                                id: prod.id,
                                name: prod.name,
                                expected_energy: prod.expected_energy
                            }))
                        );
                    }
                    else {
                        setproductprodnames([{ "id": products[0].id, "name": products[0].name, "expected_energy": products[0].expected_energy }])
                    }

                }

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, moduleName, subModule1, ProductParam])
    //console.log(node,"outside node")
    useEffect(() => {
        let updatedNodes = headPlant.node && headPlant.node.nodes && headPlant.node.nodes.length > 0 && headPlant.node.nodes.filter(n => n.type === 1).length > 0 && headPlant.node.nodes.filter(n => n.type === 1)[0].nodes && headPlant.node.nodes.filter(n => n.type === 1)[0].nodes.length > 0 && headPlant.node.nodes.filter(n => n.type === 1)[0].nodes[0]

        //console.log(headPlant.node.nodes.filter(n=>n.type === 1)[0].nodes,"nodes")
        // setnodes(headPlant.node ? headPlant.node.nodes ? tabValue === 5 ? headPlant.node.nodes.concat([{ "id": headPlant.energy_asset, "name": "Energy Asset" }]) : headPlant.node.nodes : [] : [])
        if (moduleName === 'energy' && (subModule1 === 'waterfall' || subModule1 === 'activity') && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&');

            // Create an empty object to store the values
            const queryParams = {};

            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {
                const [key, value] = param.split('=');
                queryParams[key] = value;
            });

            // Extracting the respective values
            const node = queryParams['nodes'];
            if (node) {

                setNodesParam(node)
            }
        }
        if (updatedNodes) {

            setnodes(headPlant.node.nodes.filter(n => n.type === 1)[0].nodes)
            //setnodenames([{ "id": headPlant.node.nodes[0].id, "name": headPlant.node.nodes[0].name }])
            if (moduleName === 'energy' && (subModule1 === 'waterfall' || subModule1 === 'activity')) {
                if (NodesParam !== '') {
                    let Node = NodesParam.split(',');


                    const filteredNodes = headPlant.node.nodes.filter(n => n.type === 1)[0].nodes.filter(prod => Node.includes(prod.name));

                    setactivitynodenames(
                        filteredNodes.map(node => ({
                            id: node.id,
                            name: node.name,

                        }))
                    );
                    setwaterfallnodenames(
                        filteredNodes.map(node => ({
                            id: node.id,
                            name: node.name,

                        }))
                    );

                }


            }
            else {
                setactivitynodenames([{ "id": headPlant.node.nodes.filter(n => n.type === 1)[0].nodes[0].id, "name": headPlant.node.nodes.filter(n => n.type === 1)[0].nodes[0].name }])
                setwaterfallnodenames([{ "id": headPlant.node.nodes.filter(n => n.type === 1)[0].nodes[0].id, "name": headPlant.node.nodes.filter(n => n.type === 1)[0].nodes[0].name }])
            }


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant, tabValue, NodesParam, queryParam])

    //Energy Dashboard Integration Ends



    useEffect(() => {
        if (!UpdateDashLayoutError && !UpdateDashLayoutLoading && UpdateDashLayoutData) {
            SetMessage(t('UpdatedDashboardSuccess'))
            SetType("success")
            setOpenSnack(true)
            daterangeRef?.current?.refreshDate()
        }
        if (UpdateDashLayoutError && !UpdateDashLayoutLoading && !UpdateDashLayoutData) {
            SetMessage(t('Dashboard update failed'))
            SetType("error")
            setOpenSnack(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateDashLayoutData])

    useEffect(() => {
        if (document.addEventListener) {
            document.addEventListener('webkitfullscreenchange', exitHandler, false);
            document.addEventListener('mozfullscreenchange', exitHandler, false);
            document.addEventListener('fullscreenchange', exitHandler, false);
            document.addEventListener('MSFullscreenChange', exitHandler, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!CreateDashboardLoading && !CreateDashboardError && CreateDashboardData) {
            let newDashBoardId = CreateDashboardData.returning[0].id
            SetMessage(t('Dashboard duplicated successfully'))
            SetType("success")
            setOpenSnack(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CreateDashboardData])

    function exitHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            setFullScreen(false);
        }
    }
    // console.log(tabValue,dashboardDefaultID,"tabValuetabValue") 

    function handleGridAdd(graphType) {
        try {
            let tempData = JSON.parse(JSON.stringify(SelectedDashboard.dashboard))
            let tempLayout = JSON.parse(JSON.stringify(SelectedDashboard.layout))
            const keys = Object.keys(tempData.data)
            let len = 0
            if (keys.length !== 0) {
                len = parseInt(keys[keys.length - 1])
            }
            if (graphType === 'line' || graphType === 'stackedbar' || graphType === 'groupedbar') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        tableName: headPlant.schema + "_data",
                        label: "timerange",
                        isMoment: true,
                        labelFormat: "HH:mm",
                        dataName: "value",
                        isOnline: true,
                        dataTitle: "",
                        yaxisFromRef: "",
                        yaxisToRef: "",
                        limit: 5,
                        metricField: [{ field1: { metric: [], instrument: "" } }],
                        unit: ""
                    }
                }
            } else if (graphType === 'Text') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        text: "",
                        variant: "body2"
                    }
                }
            } else if (graphType === 'map') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        instrumentMap: []
                    }
                }
            } else if (graphType === 'Image') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        src: ""
                    }
                }
            } else if (graphType === 'Status') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        instrument: "",
                        metric: "",
                        positiveText: "",
                        positiveValue: "",
                        positiveColor: "",
                        negativeText: "",
                        negativeValue: "",
                        negativeColor: ""
                    }
                }
            }
            else if (graphType === 'alerts') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        tableName: headPlant.schema + "_alerts",
                        alertid: [],
                        alertname: []
                    }
                }

            }

            else if (graphType === 'dialgauge ' || graphType === 'dialgauge2' || graphType === 'fillgauge') {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        color1: "",
                        color2: "",
                        color3: "",
                        tableName: headPlant.schema + "_alerts",
                        alertid: [],
                        alertname: []
                    }
                }

            }





            else {
                tempData.data[(len + 1).toString()] = {
                    type: graphType,
                    title: "Graph" + (len + 1),
                    meta: {
                        tableName: headPlant.schema + "_data",
                        label: "timerange",
                        isMoment: true,
                        labelFormat: "HH:mm",
                        dataName: "value",
                        isOnline: true,
                        yaxisFromRef: "",
                        yaxisToRef: "",
                        dataTitle: "",
                        limit: 5,
                        metric: [],
                        instrument: "",
                        unit: ""
                    }
                }
            }

            tempLayout.lg.push({
                w: 2,
                h: 2,
                x: (len * 2) % (tempData.cols || 12),
                y: Infinity,
                i: (len).toString()
            })
            tempLayout.sm.push({
                w: 2,
                h: 2,
                x: (len * 2) % (tempData.cols || 12),
                y: Infinity,
                i: (len).toString()
            })
            tempLayout.md.push({
                w: 2,
                h: 2,
                x: (len * 2) % (tempData.cols || 12),
                y: Infinity,
                i: (len).toString()
            })
            tempLayout.xs.push({
                w: 2,
                h: 2,
                x: (len * 2) % (tempData.cols || 12),
                y: Infinity,
                i: (len).toString()
            })

            localStorage.setItem('currentLayout', JSON.stringify(tempLayout));
            let obj = { layout: tempLayout, dashboard: tempData };
            setSelectedDashboardSkeleton(obj)
            SetMessage(t('NewGraphAdded'))
            SetType("success")
            setOpenSnack(true)
            handleClose()
        } catch (err) {
            console.log('handle grid add', err);
        }


    }
    function timeToSeconds(time) {
        const [minutes, seconds] = time.split(':').map(Number);
        return minutes * 60 + seconds;
    }
    const handleSaveChanges = () => {
        setEnableRearrange(false)
        let tempData = JSON.parse(JSON.stringify(SelectedDashboard.dashboard))
        let tempLayout = JSON.parse(JSON.stringify(SelectedDashboard.layout))
        let refValue = intervalRef.current?.textMaskInputElement?.state?.previousConformedValue ?? "00:00";
        // console.log(intervalRef.current && intervalRef.current.textMaskInputElement.state.previousConformedValue,"intervalRef.current.textMaskInputElement.state.previousConformedValue",refValue ?( 3600 / getSeconds(refValue)) : '')
        tempData.interval = timeToSeconds(refValue)
        tempData.isCustomInterval = isCustomInterval
        const layout = { dashboard: tempData, layout: tempLayout };
        localStorage.setItem('actual_layout', JSON.stringify(layout))
        if (tempData.interval < 60 && isCustomInterval) {
            SetMessage("Please Select Above One Minute")
            SetType("warning")
            setOpenSnack(true)
            return false
        }
        getUpdateDashData({ dashboard: tempData, dash_id: dashboardDefaultID, user_id: currUser.id })
        getUpdateDashLayout({ layout: tempLayout, dash_id: dashboardDefaultID, user_id: currUser.id })
        setEditMode(false)
        props.handleModal(false)

    };

    const handleClick = (event) => {
     
        props.handleModal(true)
        editRef.current.openDialog(props.detail)
    };

    const handleClose = () => {
        setOpenGap(false)
        setopenCharts(false)
        setAnchorPos(null)
    };

    const chartOption = [
        { name: "LineChart", type: "line", icon: LineLight, stroke: theme.colorPalette.primary },
        { name: "BarChart", type: "bar", icon: BarLight, stroke: theme.colorPalette.primary },
        { name: "Stacked Bar Chart", type: "stackedbar", icon: BarLight, stroke: theme.colorPalette.primary },
        { name: "PieChart", type: "pie", icon: DonutLight, stroke: theme.colorPalette.primary },
        { name: "Donut Chart", type: "donut", icon: DonutLight, stroke: theme.colorPalette.primary },
        { name: "AreaChart", type: "area", icon: AreaLight, stroke: theme.colorPalette.primary },
        { name: "SingleValue", type: "singleText", icon: ViewDay, stroke: theme.colorPalette.primary },
        { name: "Dial Gauge 1", type: "dialgauge", icon: GaugeLight, stroke: theme.colorPalette.primary },
        { name: "Dial Gauge 2", type: "dialgauge2", icon: GaugeLight, stroke: theme.colorPalette.primary },
        { name: "Radial Gauge", type: "fillgauge", icon: GaugeLight, stroke: theme.colorPalette.primary },
        { name: "Text", type: "Text", icon: ViewDay, stroke: theme.colorPalette.primary },
        { name: "Image & Icon", type: "Image", icon: ViewDay, stroke: theme.colorPalette.primary },
        { name: "Status", type: "Status", icon: ViewDay, stroke: theme.colorPalette.primary },
        { name: "Alert Panel", type: "alerts", icon: AlarmIcon, stroke: theme.colorPalette.primary },
        { name: "Map", type: "map", icon: MapIcon, stroke: theme.colorPalette.primary },
    ]

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            setFullScreen(true)
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                setFullScreen(false)
                document.exitFullscreen();
            }
        }
    }


    const OnchangeOEEAsset = (event) => {
        if (event.target.value === 0) {
            setSelectedOEEAsset({ show: true, id: 0 })
        }
        else {
            const selectedAsset = oeeAssetsArray.filter(x => x.entity.id === event.target.value);
            if (selectedAsset.length > 0) {
                if (selectedAsset[0]?.entity?.dryer_config?.is_enable) {
                    setIsDryer(true);
                } else {
                    setIsDryer(false);
                }
            } else {
                setIsDryer(false);
            }
            setSelectedOEEAsset({ show: true, id: event.target.value })
            localStorage.setItem('assetSelected', event.target.value)
        }
    }

  

    const nodeisAllSelected =
        tabValue === 4 ? nodes.length > 0 && waterfallnodenames.length === nodes.length :
            nodes.length > 0 && activitynodenames.length === nodes.length;

    const AverageTypes = [{ "id": 1, "title": "Auto Expected" }, { "id": 2, "title": "Manual Expected" }]
    const categories = [{ "id": 1, "category": "Hourly" }, { "id": 2, "category": "Daily" }, { "id": 3, "category": "Weekly" }, { "id": 4, "category": "Monthly" }]
    const years = Array.from(new Array(100), (val, index) => { return { "year": index + 2020, "name": index + 2020 } });


    const handlecategories = (e) => {
        localStorage.setItem("currCategoryValue", e.target.value);
        setcategory(e.target.value)
    }

    const handleyears = (e) => {
        if (tabValue === 2) setproductyear(e.target.value)
        else setactivityyear(e.target.value)
    }

    const handleaveragetype = (e) => {
        setaveragetype(e.target.value)
    }
    const handleProducts = (e) => {

        if (tabValue === 2) {
            e.forEach(obj => { delete obj["checked"]; });

            if (JSON.stringify(productprodnames) !== JSON.stringify(e)) {
                setproductprodnames(e)
            }

        }
        else if (tabValue === 5) setactivityprodnames(e);
        else if (tabValue === 3) setenergyprodnames(e)

    }

    const handleNodes = (e) => {
        const value = e.target.value;
        if (value[value.length - 1] === "all") {
            if (tabValue === 4) setwaterfallnodenames(waterfallnodenames.length === nodes.length ? [] : nodes);
            else if (tabValue === 5) setactivitynodenames(activitynodenames.length === nodes.length ? [] : nodes)
            return;
        }
        let tempnodenames = []
        // eslint-disable-next-line array-callback-return
        value.map(val => {
            let filtered = nodes.filter(prod => prod.id === val)
            if (filtered.length > 0) tempnodenames.push({ "id": filtered[0].id, "name": filtered[0].name }) //should always return this object
        })
        if (tabValue === 4) setwaterfallnodenames(tempnodenames)
        else if (tabValue === 5) setactivitynodenames(tempnodenames)
    }

    const handleEnergyType = (e) => {
        setselectedenergytype(e.target.value)
    }
    
    const handleNullPopper = (e) => {
        setOpenGap(!openGap)
        setAnchorPos(e.currentTarget)
    }

    function optionChange(e) {
        if (e === "edit") {
            enableEditMode()
            setOpenGap(!openGap)
            setAnchorPos(null)
        }
        if (e === "duplicate") {
            // console.log("duplicate")
            duplicateFormRef.current.openDialog('duplicate')
            setOpenGap(!openGap)
            setAnchorPos(null)
        }
        // setHideGap(!hideGap)

    }

    function handleActivity(e) {
        setActivityValue(e)
    }

    function alloptionsproducttab() {
        if (headPlant.node && headPlant.node.product_energy) {
            //products primary filter
            if (headPlant.node.product_energy.primary === 1) {
                return ["Products", "All Products"]
            } else {
                if (headPlant.node.product_energy.prod_type === 3) {
                    return ["Families", "All Family"]
                } else if (headPlant.node.product_energy.prod_type === 2) {
                    return ["Thickness", "All Thickness"]
                } else if (headPlant.node.product_energy.prod_type === 1) {
                    return ["Tint", "All Tint"]
                }
            }
        } else {
            return ["Select Product"]
        }
    }
    const productValueReturn = () => {
        if (tabValue === 2) {
            return productprodnames

        } else if (tabValue === 5) {
            return activityprodnames

        } else {
            return energyprodnames

        }

    }



    const handleinterval = () => {

        setisCustomInterval(!isCustomInterval)

    }
    function toggleChange(e, opt) {
        let menu = opt.map(f => {
            if (f.id === e.id) {
                if (e.id === 'showGap') {
                    // console.log('enter')
                    // setcharttype(!e.checked)
                    setHideGap(!hideGap)
                    return { ...f, checked: !e.checked }
                }
            } else {
                return f;
            }
        })
        setmenuOptions(menu)

    }
    const handleWorkExecution = (e) => {
            if(dashboardDefaultID === "cdf940e6-9445-4d3d-a175-22caa159d7a0"){
                const arraysAreEqual=(arr1,arr2 )=> {
                    if (arr1.length !== arr2.length) return false;
                
                    return arr1.every((val, index) => val.id === arr2[index].id);
                }
                if(arraysAreEqual(e,workExecutionID)){
                    return false
                } 
                // console.log(arraysAreEqual(e,workExecutionID),"arraysAreEqual(e,workExecutionID)",e,workExecutionID)
                setWorkExecutionDetails(e)
            }else{
                setWorkExecutionDetails(ExecutionOption.map((x, i) => { return { ...x, WOorderid: x?.orderid + " - " + (i + 1) } }).filter((z) => z.id === e.target.value) )
            }
            
        
        

        // setWorkExecutionID(e)
    }

    const clickAwaySearch = () => {
        if (DashboardFilters.Search === '')
            setInput(false)
        else
            setInput(true)
    }
    
    const dashboardFilterOption = [
        {id:"all",name:"All Dashboards"},
        {id:"onlyme",name:"Created By Me"},
        {id:"stared",name:"Starred"},
      
      ]
      
      const dashboardSortOption = [
        {id:"a-z",name:"Alphabetical: A-Z"},
        {id:"z-a",name:"Alphabetical: Z-A"},
        {id:"frequently",name:"Frequently Opened"},
        {id:"rarely",name:"Rarely Opened"},
      
      ]

      const updateSearch=(e)=>{
        setDashboardFilters({...DashboardFilters,Search:e.target.value})
      }



  const handleFilterChange =(e)=>{
    setDashboardFilters({...DashboardFilters,filter:e.target.value})


  }
  const handleSortChange =(e)=>{
    setDashboardFilters({...DashboardFilters,Sort:e.target.value})
  }

  const handleNewdashboard=()=>{
    duplicateFormRef.current.openDialog('add')
  }





    return (
        <React.Fragment>
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark px-4 py-2' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                    <DashboardSelectbox ref={selectRef} handleTriggerDashboard={props.handleTriggerDashboard} isFullScreen={isFullScreen} toggleFullScreen={toggleFullScreen} handleSnackbar={props.handleSnackbar} UserOption={UserOption} editAccess={(access) => setEditAccess(access)} style={{ width: 300 }} />
                    <div style={{ display: "flex", placeContent: "flex-end" }} >
                        {
                            (selectedDashboard && selectedDashboard.length === 1 && selectedDashboard[0].custome_dashboard && selectedDashboardPage.name !== 'Dashboard') && (
                                <React.Fragment>
                                    <div style={{ display: editMode ? "flex" : "none", columnGap: 8, alignItems: 'center' }} >
                                       

                                        <ButtonNDL
                                            id="edit-dashboard"
                                            type="secondary"
                                            value={t("Cancel")}
                                            onClick={cancelEditMode}
                                        />

                                        <ButtonNDL
                                            id="edit-dashboard"
                                            type="primary"
                                            value={t("Save")}
                                            onClick={handleSaveChanges}
                                        />
                                    </div>


                                    <div style={{ display: editMode ? "none" : "inline-flex", columnGap: "8px", alignItems: "center" }}>

                                        {!live && selectedDashboard[0].datepicker_type !== 'widgetpicker' && <ToolTip title={t('refreshDashboard')} placement="bottom" onClick={() => { daterangeRef?.current?.refreshDate(); setPlayMode(false) }}  >
                                            <div style={{ minWidth: 30, display: 'flex', alignItems: 'center',cursor:"pointer" }} >
                                                <RefreshLight fontSize='small' stroke={mainTheme.colorPalette.primary} />
                                            </div>
                                        </ToolTip>}
                                        {
                                            localStorage.getItem('customDashboard') === '6' && selectedDashboard[0].datepicker_type !== 'widgetpicker' &&
                                            <ToolTip title={live ? 'Stop Live' : 'Go Live'} placement="bottom" onClick={() => { setLive(!live); setPlayMode(false) }}  >
                                                <div style={{ minWidth: 30, display: 'flex', alignItems: 'center',cursor:"pointer" }} >
                                                    {live
                                                        ? <Pause fontSize='small' stroke={mainTheme.colorPalette.primary} />
                                                        : <Play fontSize='small' stroke={mainTheme.colorPalette.primary} />
                                                    }
                                                </div>
                                            </ToolTip>
                                        }
                                        {
                                            !isFullScreen &&
                                            <ToolTip title={t('fullscreen')} placement="bottom" onClick={() => toggleFullScreen()}  >
                                                <div style={{ minWidth: 30, display: 'flex', alignItems: 'center',cursor:"pointer" }} >

                                                    <FullScreenLight fontSize='small' stroke={mainTheme.colorPalette.primary} />

                                                </div>
                                            </ToolTip>
                                        }
                                        {isFullScreen &&
                                            <ToolTip title={t('exitfullscreen')} placement="bottom" onClick={() => toggleFullScreen()}  >
                                                <div style={{ minWidth: 30, display: 'flex', alignItems: 'center',cursor:"pointer" }} >

                                                    <ExitFullScreenLight fontSize='small' stroke={mainTheme.colorPalette.primary} />

                                                </div>
                                            </ToolTip>
                                        }

                                      
                                        {!live && selectedDashboard[0].datepicker_type !== 'widgetpicker' && <DateRange ref={daterangeRef} editMode={editMode} range={RangeParam} />}
                                        {!live
                                            &&
                                              <ToolTip title={'Menu'} placement="bottom"  >
                                            <ButtonNDL icon={MoreVertLight} type='ghost' onClick={(e) => handleNullPopper(e)} />

                                             </ToolTip> 
                                        }

                                        <ListNDL
                                            options={!editAccess ? menuOptions.filter(x => x.id !== "edit") : menuOptions}
                                            Open={openGap}
                                            optionChange={optionChange}
                                            keyValue={"name"}
                                            keyId={"id"}
                                            id={"popper-Gap"}
                                            onclose={handleClose}
                                            IconButton
                                            isIconRight
                                            anchorEl={AnchorPos}
                                            width="170px"
                                            toggleChange={toggleChange}
                                        />
                                    </div>
                                </React.Fragment>
                            )}
                        {
                        selectedDashboardPage.name === 'Dashboard' ?
                       
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%', columnGap: '8px' }}>
                  <ClickAwayListener onClickAway={clickAwaySearch}>
            {input ? <div><InputFieldNDL
                autoFocus
                id="Table-search"
                placeholder={t("Search")}
                size="small"
                value={DashboardFilters.Search} 
                type="text"
                onChange={updateSearch}
                disableUnderline={true}
                startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} />}
                endAdornment={props.searchTerm !== '' && <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} onClick={() => { setDashboardFilters({...DashboardFilters,Search:''}); setInput(true) }} />}
            /></div> : <ButtonNDL type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />}

                  </ClickAwayListener>
                  <div className='w-[200px]'>
                  <SelectBox
                labelId="reportSelect-label"
                id="reportSelect-NDL"
                options={dashboardFilterOption}
                value={DashboardFilters.filter}
                onChange={(e)=>handleFilterChange(e)}
                keyValue="name"
                keyId="id"
              />
                  </div>

                  <div className='w-[200px]'>
                  <SelectBox 
              labelId="reportSelect-label"
              id="reportSelect-NDL"
              options={dashboardSortOption}
              value={DashboardFilters.Sort}
              onChange={(e)=>handleSortChange(e)}
              keyValue="name"
              keyId="id"
              
            />
                  </div>
                <ButtonNDL   value={"New Dashboard"} onClick={handleNewdashboard}  iconAlignLeft icon={NewReport}  />
              </div>
                       
                        :
                        !(selectedDashboard && selectedDashboard.length === 1 && selectedDashboard[0].custome_dashboard ) && (
                            <div style={{ display: 'inline-flex', columnGap: 5, width: '100%', justifyContent: 'flex-end', alignItems: "center", gap: "8px" }}>
                                {
                                    !isFullScreen &&
                                    <ToolTip title={t('fullscreen')} placement="bottom" onClick={() => toggleFullScreen()}  >
                                        <div style={{ minWidth: 30, display: 'flex', alignItems: 'center',cursor:"pointer" }} >
                                            <FullScreenLight fontSize='small' stroke={mainTheme.colorPalette.primary} />
                                        </div>
                                    </ToolTip>}
                                {isFullScreen &&
                                    <ToolTip title={t('exitfullscreen')} placement="bottom" onClick={() => toggleFullScreen()}  >
                                        <div style={{ minWidth: 30, display: 'flex', alignItems: 'center',cursor:"pointer" }} >

                                            <ExitFullScreenLight fontSize='small' stroke={mainTheme.colorPalette.primary} />

                                        </div>
                                    </ToolTip>
                                }

                                {(dashboardDefaultID === "cdf940e6-9445-4d3d-a175-22caa159d7a0" || dashboardDefaultID === "8c1bf778-c689-4bd4-a577-8008eb3a0547") && headPlant.type === '2' &&
                                    <div style={{ minWidth: "220px" }}>
                                        <SelectBox
                                            labelId="assetSelect-label"
                                            label=""
                                            id="assetSelect"
                                            placeholder={t("SelectAsset")}
                                            auto={false}
                                            multiple={false}
                                            options={AssetOption}
                                            isMArray={true}
                                            checkbox={false}
                                            value={selectedOEEAsset.id}
                                            onChange={OnchangeOEEAsset}
                                            keyValue="name"
                                            keyId="id"
                                        />
                                    </div>
                                }
                                {dashboardDefaultID === "00e6ca54-8a94-414a-80e4-69cd3752647c" && headPlant.type === '2' &&
                                    <div style={{ minWidth: "220px" }}>
                                        <SelectBox
                                            labelId="Select-type-label"
                                            label=""
                                            id="selectTypeLabel"
                                            placeholder={t("SelectType")}
                                            auto={false}
                                            options={offlineTypesData}
                                            isMArray={true}
                                            value={selectedOfflineType}
                                            onChange={handleChangeOfflineType}
                                            keyValue="name"
                                            keyId="id"
                                            multiple={true}
                                            checkbox={true}
                                            selectAll={true}
                                            selectAllText={"All Types"}
                                        />
                                    </div>
                                }

                                {dashboardDefaultID === "85b5b3c1-476b-4a4d-95a4-67631c2ea013" && headPlant && headPlant.node && headPlant.node.energy_contract && headPlant.node.energy_contract.IsContract === true &&
                                    <div style={{ minWidth: "220px" }}>
                                        <SelectBox
                                            labelId="Select-type-label"
                                            label=""
                                            id="selectTypeLabel"
                                            placeholder={t("Select Contract")}
                                            auto={false}
                                            options={contractOption}
                                            isMArray={true}
                                            value={selectedContracts}
                                            onChange={handleContractChange}
                                            keyValue="name"
                                            keyId="id"
                                            multiple={true}
                                            checkbox={true}
                                            selectAll={true}
                                            selectAllText={"All Contracts"}
                                        />
                                    </div>
                                }

                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && tabValue === 1) &&
                                    <div style={{ width: "fit-content" }}>
                                        <SelectBox
                                            id='select-category'
                                            value={category}
                                            placeholder={t("Category")}
                                            auto={false}
                                            edit={true}
                                            onChange={(e) => handlecategories(e)}
                                            options={categories}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"category"}
                                            multiple={false}
                                        />
                                    </div>
                                }
                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && (tabValue === 2)) &&
                                    <DatePickerNDL
                                        id="Product-SQMT-Date"
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setProdSqmtRange({ start: start, end: end })
                                        }}
                                        startDate={ProdSqmtRange.start}
                                        endDate={ProdSqmtRange.end}
                                        dateFormat="dd MMM yyyy "
                                        selectsRange={true}
                                        maxDate={new Date(moment(new Date(ProdSqmtRange.start)).add(3, 'months').format("YYYY-MM-DD HH:mm:ss"))}
                                        disabled={productsqmttabloading}
                                        maxDays={moment().diff(moment().add(3, 'months'), "days")}

                                    />
                                }
                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && (tabValue === 2 || tabValue === 3 || tabValue === 5)) &&
                                    <div style={{ minWidth: "200px" }}>
                                        <SelectBox
                                            id='select-product'
                                            placeholder={alloptionsproducttab().length > 0 ? alloptionsproducttab()[0] : ""}
                                            value={productValueReturn()}
                                            auto={true}
                                            onChange={(e) => handleProducts(e)}
                                            options={tabValue === 2 ? ProductOption : products}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"name"}
                                            multiple={true}
                                            checkbox={true}
                                            selectAll
                                         
                                            selectAllText={alloptionsproducttab().length > 0 ? alloptionsproducttab()[1] : ""}
                                            disabled={productsqmttabloading}
                                      

                                        />
                                    </div>
                                }
                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && tabValue === 3) &&
                                    <div >
                                        <SelectBox
                                            id='select-averagetype'
                                            placeholder={t("type")}
                                            value={averagetype}
                                            auto={false}
                                            edit={true}
                                            onChange={(e) => handleaveragetype(e)}
                                            options={AverageTypes}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"title"}
                                            multiple={false}



                                        />
                                    </div>
                                }

                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && (tabValue === 5)) &&
                                    <div >
                                        <SelectBox
                                            id='select-year'
                                            placeholder={t("Year")}
                                            value={tabValue === 2 ? productyear : activityyear}
                                            auto={false}
                                            edit={true}
                                            onChange={(e) => handleyears(e)}
                                            options={years}
                                            isMArray={true}

                                            keyId={"year"}
                                            keyValue={"name"}
                                            multiple={false}
                                        />
                                    </div>
                                }
                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && (tabValue === 2)) &&
                                    <div style={{ width: '300px' }}>
                                        <SelectBox
                                            id='select-activity'
                                            placeholder={t("Activity")}
                                            value={ActivityValue}
                                            onChange={(e) => handleActivity(e)}
                                            options={ActivityOption}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"name"}
                                            multiple
                                            selectAll
                                            selectAllText={"All Activity"}
                                            disabled={productsqmttabloading}
                                        />
                                    </div>
                                }


                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && (tabValue === 4 || tabValue === 5)) &&
                                    <div style={{ width: "300px" }}>
                                        <SelectBox
                                            id='select-node'
                                            placeholder={t('Nodes')}
                                            value={tabValue === 4 ? waterfallnodenames : activitynodenames}
                                            auto={false}
                                            edit={true}
                                            onChange={(e) => handleNodes(e)}
                                            options={nodes}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"name"}
                                            multiple={true}
                                            checkbox={true}
                                            renderValue={(selected) => tabValue === 4 ? selected.map(s => waterfallnodenames[waterfallnodenames.findIndex(p => p.id === s)].name).join(',')
                                                : selected.map(s => activitynodenames[activitynodenames.findIndex(p => p.id === s)].name).join(',')}
                                            selectall={true}
                                            isAllSelected={nodeisAllSelected}
                                            selectAllText={"All Nodes"}

                                        />
                                    </div>
                                }

                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" && tabValue === 4) &&
                                    <div style={{ display: "flex" }}>
                                        {/* <div style={{ width: "fit-content",}}> */}
                                        <DatePickerNDL
                                            id="Date-Energy"
                                            onChange={(dates) => {
                                                setEnergyrange({ date: dates, compare: energyrange.compare })
                                            }}
                                            maxDate={new Date()}
                                            startDate={energyrange.date}
                                            dateFormat="MMM dd yyyy"
                                            placeholder={t("Date")}
                                        />

                                        {/* </div> */}
                                        <div>
                                            <DatePickerNDL
                                                id="Compare-Date-Energy"
                                                onChange={(dates) => {
                                                    setEnergyrange({ date: energyrange.date, compare: dates })
                                                }}
                                                maxDate={new Date()}
                                                startDate={energyrange.compare}
                                                dateFormat="MMM dd yyyy"
                                                placeholder={"Compare Date"}
                                            />
                                        </div>
                                    </div>
                                }

                                {dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" &&
                                    (tabValue === 0 || tabValue === 3) && (
                                        <DateRange range={RangeParam} Children={(dashboardDefaultID === "0cb34336-2431-44fd-94b1-cc8d85dec537" || dashboardDefaultID === "cdf940e6-9445-4d3d-a175-22caa159d7a0") ? "Production" : ''} />
                                    )
                                }

                                {dashboardDefaultID === "00e6ca54-8a94-414a-80e4-69cd3752647c" &&
                                    <DatePickerNDL
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setCmsDashboardRange({ start: start, end: end })
                                        }}
                                        startDate={CmsDashboardRange.start}
                                        endDate={CmsDashboardRange.end}
                                        dateFormat="MMM yyyy "
                                        width={"250px"}
                                        selectsRange={true}
                                        showTimeSelect={false}
                                        showYearPicker={false}
                                        showMonthYearPicker={true}
                                        maxDate={new Date(moment(new Date(CmsDashboardRange.start)).add(11, 'months').format("YYYY-MM-DD HH:mm:ss"))}
                                        maxDays={365}
                                    />
                                }
                                {dashboardDefaultID === "85b5b3c1-476b-4a4d-95a4-67631c2ea013" && headPlant && headPlant.node && headPlant.node.energy_contract && headPlant.node.energy_contract.IsContract === true &&
                                    <DatePickerNDL
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setContractDashboardRange({ start: start, end: end })
                                        }}
                                        startDate={contractDashboardRange.start}
                                        endDate={contractDashboardRange.end}
                                        dateFormat="MMM yyyy "
                                        width={"250px"}
                                        selectsRange={true}
                                        showTimeSelect={false}
                                        showYearPicker={false}
                                        showMonthYearPicker={true}
                                        maxDate={new Date(moment(new Date(contractDashboardRange.start)).add(11, 'months').format("YYYY-MM-DD HH:mm:ss"))}
                                        maxDays={365}
                                    />
                                }

                                {dashboardDefaultID === "a01c23c0-2fbb-4a32-b42a-a84b01b302cb" &&
                                    connectivityloading && (
                                        <div className='flex gap-2'>
                                            <ProgressIndicator />
                                            <Typography variant={"label-02-m"} value={"Fetching Connectivity Data"} />
                                        </div>
                                    )
                                }

                                {dashboardDefaultID !== "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf" &&
                                    (dashboardDefaultID !== 'f53f8175-96f4-4eb7-a7d3-5c15185b47e9') &&
                                    dashboardDefaultID !== "85b5b3c1-476b-4a4d-95a4-67631c2ea013" &&
                                    dashboardDefaultID !== "00e6ca54-8a94-414a-80e4-69cd3752647c" &&
                                    dashboardDefaultID !== "a01c23c0-2fbb-4a32-b42a-a84b01b302cb" &&
                                    dashboardDefaultID !== "3e0cd86a-191c-4b69-b467-22c3ff433419" &&
                                    moduleName !== "contract" &&
                                    (
                                        <div style={{ minWidth: "380px" }}>
                                            <DateRange range={RangeParam} moduleName={moduleName} Children={(dashboardDefaultID === "0cb34336-2431-44fd-94b1-cc8d85dec537" || dashboardDefaultID === "cdf940e6-9445-4d3d-a175-22caa159d7a0") ? "Production" : ''} />
                                        </div>
                                        
                                    )
                                }

                                {
                                    dashboardDefaultID === "3e0cd86a-191c-4b69-b467-22c3ff433419" &&
                                    (<div style={{ minWidth: "220px" }}>
                                        <SelectBox
                                            labelId="assetSelect"
                                            id="assetSelect"
                                            auto={false}
                                            placeholder={t("SelectAsset")}
                                            multiple={false}
                                            options={OptixAssetoption}
                                            isMArray={true}
                                            checkbox={false}
                                            value={optixAssert.value}
                                            onChange={handleOptixAssertChange}
                                            keyValue="name"
                                            keyId="id"
                                        />
                                    </div>)
                                }



                                {(dashboardDefaultID === "cdf940e6-9445-4d3d-a175-22caa159d7a0" || dashboardDefaultID === "8c1bf778-c689-4bd4-a577-8008eb3a0547") && headPlant.type === '2' && executionList.length > 0 && (
                                    <div style={{ minWidth: "220px" }}>
                                        <SelectBox
                                            labelId="woexecution"
                                            // label="{t('Execution')}"
                                            placeholder={"Select an Execution"}
                                            id="execution-select"
                                            auto={false}
                                            multiple={dashboardDefaultID !== "8c1bf778-c689-4bd4-a577-8008eb3a0547"}
                                            options={ExecutionOption.map((x, i) => { return { ...x, WOorderid: x?.orderid + " - " + (i + 1) } })}
                                            isMArray={dashboardDefaultID !== "8c1bf778-c689-4bd4-a577-8008eb3a0547" }
                                            checkbox={dashboardDefaultID !== "8c1bf778-c689-4bd4-a577-8008eb3a0547" }
                                            value={dashboardDefaultID === "8c1bf778-c689-4bd4-a577-8008eb3a0547" ? workExecutionID?.[0]?.id : workExecutionID}
                                            onChange={(e) => handleWorkExecution(e)}
                                            keyValue="WOorderid"
                                            keyId="id"
                                            selectAll={dashboardDefaultID !== "8c1bf778-c689-4bd4-a577-8008eb3a0547" }
                                            selectAllText={"All Execution"}

                                        />
                                    </div>
                                )

                                }

                                {(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf") && tabValue === 0 &&
                                    <div >
                                        <SelectBox
                                            id='select-energy-type'
                                            placeholder={t("Select Energy Type")}
                                            value={selectedenergytype}
                                            auto={false}
                                            edit={true}
                                            onChange={(e) => handleEnergyType(e)}
                                            options={energytypes}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"resource"}
                                            multiple={false}
                                        />
                                        
                                    </div>

                                }
                                
                            </div>
                        )
                        }

                        <ListNDL
                            options={chartOption}
                            Open={openCharts}
                            optionChange={handleGridAdd}
                            keyValue={"name"}
                            keyId={"type"}
                            id={"popper-Chart"}
                            onclose={handleClose}
                            anchorEl={AnchorPos}
                            width="200px"
                            isIcon
                        />

                    </div>
                </div>
                {ProgressBar &&
                    <LoadingScreenNDL />
                }
                <EditSetting ref={editRef} AlertList={AlertList} selectedDashboard={selectedDashboard} />

                <DashboardForm
                    UserOption={UserOption}
                    handleSnackbar={props.handleSnackbar}
                    ref={duplicateFormRef}
                    getDashboardList={(headplant, userid, id) => { selectRef.current.updateSelectedDashboard(headplant, userid, id);props.getUpdatedDashBoard() }}
                />
            </div>
            {
                            (selectedDashboard && selectedDashboard.length === 1 && selectedDashboard[0].custome_dashboard && selectedDashboardPage.name !== 'Dashboard' && editMode) && (
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark px-4 py-2 border-b border-Border-border-50 dark:border-Border-border-dark-50'>
        
                                            <div className='flex justify-end gap-4 items-center'>
                                                <CustomSwitch
                                                    id={"interval"}
                                                    switch={false}
                                                    checked={isCustomInterval}
                                                    onChange={handleinterval}
                                                    primaryLabel={'Custom Refresh Rate'}
                                                />
                                                 <div style={{ width: "80px" }}>
                                                {
                                                    isCustomInterval &&
                                                    <MaskedInput
                                                        mask={[
                                                            /[0-5]/,
                                                            /\d/,
                                                            ":",
                                                            /[0-5]/,
                                                            /\d/,
                                                        ]}
                                                        style={classes.maskedInput}
                                                        ref={intervalRef}
                                                        defaultValue={EditInterval}
                                                        placeholder={'MM:SS'}
                                                    />
                                                }
                                                {
                                                    !isCustomInterval &&
                                                    <MaskedInput
                                                        mask={[
                                                            /[0-5]/,
                                                            /\d/,
                                                            ":",
                                                            /[0-5]/,
                                                            /\d/,
                                                        ]}
                                                        style={classes.maskedInput}
                                                        defaultValue={"00:59"}
                                                        placeholder={'MM:SS'}
                                                        disabled={true}
                                                    />
                                                }


                                            </div>
                                            <ButtonNDL
                                            id="new-widget"
                                            style={{ minWidth: 80 }}
                                            type="tertiary"
                                            value={t("Add Widget")}
                                            icon={NewReport}
                                            onClick={handleClick}
                                        />
                                            </div>

                                           
                                      
            </div>
                            )
                        }

            
        </React.Fragment>

    )
}
export default DashboardHeader;
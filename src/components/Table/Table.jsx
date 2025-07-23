import React, { useEffect, useMemo, useState, useRef } from "react";
import useGetTheme from 'TailwindTheme';
import { useRecoilState } from "recoil";
import { themeMode, AlarmColumnFilter, snackToggle } from "recoilStore/atoms";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import moment from 'moment';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Edit from 'assets/neo_icons/Menu/ActionEdit.svg?react';
import CheravonDown from 'assets/neo_icons/Logos/chevron_down_leftBar.svg?react';
import CheravonUp from 'assets/neo_icons/Logos/chevron-up_leftBar.svg?react';
import TableSearch from "./TableSearch";
import Downloads from 'assets/neo_icons/Menu/newTableIcons/download_table.svg?react';
import TableDownload from "./TableDownload";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import EnhancedTableHeader from "./TableHeader";
import EnhancedTablePagination from "./TablePagination";
import PlusIcon from 'assets/neo_icons/Menu/plus_icon.svg?react';
import Plus from 'assets/plus.svg?react';
import Trend from 'assets/trend.svg?react';
import FFT from 'assets/fft.svg?react';
import Eye from 'assets/neo_icons/Menu/eye.svg?react';
import FileDownload from 'assets/neo_icons/Menu/FileDownload.svg?react';
import FileUpload from 'assets/neo_icons/Menu/FileUpload.svg?react';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import { useTranslation } from 'react-i18next';
import History from 'assets/neo_icons/Menu/History.svg?react';
import Tooltip from "components/Core/ToolTips/TooltipNDL";
import Left from 'assets/neo_icons/Arrows/boxed_left.svg?react';
import CustomTextField from "components/Core/InputFieldNDL";
import Right from 'assets/neo_icons/Arrows/boxed_right.svg?react';
import KeyboardArrowDownIcon from 'assets/neo_icons/Arrows/boxed_down.svg?react';
import KeyboardArrowUpIcon from 'assets/neo_icons/Arrows/boxed_up.svg?react';
import DuplicateIcon from 'assets/neo_icons/Equipments/Duplicate.svg?react';
import EyeView from 'assets/neo_icons/Dashboard/eye.svg?react';
import DragIcon from '../../assets/Vertical-Menu.svg?react';
// import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import ListNDL from '../Core/DropdownList/ListNDL';
import { arrayMoveImmutable } from 'array-move';
import LoadingScreen from "LoadingScreenNDL"
import TestConnection from 'assets/neo_icons/Settings/test_connections.svg?react';
import Circledashed from 'assets/neo_icons/Dashboard/circle-dashed.svg?react';
import VectorMenu from '../../assets/Vector-Icon.svg?react';
import Column from '../../assets/column.svg?react';
import Groupby from '../../assets/layout-rows.svg?react';
import Sortby from '../../assets/arrows-sort.svg?react';
import CharavonRight from 'assets/neo_icons/Menu/chevron-right.svg?react';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import Checkboxs from 'components/Core/CustomSwitch/CustomSwitchNDL';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import AccordianNDL from "components/Core/Accordian/AccordianNDL";
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";
import { groupByConfig } from "./groupByConfig";
// import 
import ProgressIndicatorNDL from "components/Core/ProgressIndicators/ProgressIndicatorNDL";


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  // // console.log(stabilizedThis.map((el) => el[0]),"table sort")
  return stabilizedThis.map((el) => el[0]);
}

function Table(props) {
  const { t } = useTranslation();
  const theme = useGetTheme();
  const [order, setOrder] = useState(props.order ? props.order : "asc");
  const [orderBy, setOrderBy] = useState(props.orderBy ? props.orderBy : "");
  const [page, setPage] = useState(props.page ? props.page : 0);
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage ? props.rowsPerPage : 10);
  const [curTheme] = useRecoilState(themeMode);
  const [search, setSearch] = useState("");
  const [downloadabledata, setDownloadabledata] = useState([]);
  const [updatedData, setupdatedData] = useState([]);
  const [completeTableData, setCompleteTableData] = useState([]);
  const [visibleheadCells, setvisibleheadCells] = useState([]);
  const [visibledata, setvisibledata] = useState([]);
  const [openaccordion, setOpenAccordion] = useState(false)
  const [openIndex, setOpenIndex] = useState([])
  const [ColumunOrder, setColumunOrder] = useState([])
  const [IscolChange,setIscolChange]= useState(false);
  const [isopen, setIsopen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [rowCheckedId, setRowCheckedId] = useState([])
  const [selectedDataDownload, setselectedDataDownload] = useState([])
  const [selectedcolnames, setselectedcolnames] = useState([])
  const [columnOption, setColumnOption] = useState([])
  const [openMenu, setOpenMenu] = useState(false);
  const [snackOpen] = useRecoilState(snackToggle);
  const [open, setOpen] = useState(false);
  const [originaldatadownload, setoriginaldatadownload] = useState([]);
  const [AnchorPoss, setAnchorPoss] = useState(null);
  const [filteredDownloadableData, setfilteredDownloadableData] = useState([])
  const [AnchorPossDown, setAnchorPossDown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [columnFilterOpen, setColumnFilterOpen] = useState(false);
  const [anchorE2, setAnchorE2] = useState(null);
  const [showLabel, setShowLabel] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [optimiseTableData, setOptimiseTableData] = useState([]);
  const [OptionArray, setOptionArray] = useState([]);
  const [selectedgroupby, setselectedgroupby] = useState("");
  const [SearchArray, setSearchArray] = useState([]);
  const [scrollState, setscrollState] = useState(false);
  const [isshowbutton, setisshowbutton] = useState([]);
  const [ColAllOption, setColAllOption] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [opendownlist, setopendownlist] = useState([]);
  // For Column Grouping 
  const [columnGroupOpen, setColumnGroupOpen] = useState(false);
  const [anchorE3, setAnchorE3] = useState(null);
  const [groupByOptions, setGroupByOptions] = useState(groupByConfig[props.groupBy])
  const [groupBy, setGroupBy] = useState('')
  const [accordians, setAccordians] = useState([])
  const [accodianOpen, setAccodianOpen] = useState({})
  const [tableColumns, setTableColumns] = useState([])
  const [AnchorPos, setAnchorPos] = useState(null);
  const mainTheme = useGetTheme();
  const menuOption = [
    { id: "groupBy", name: "Group By", stroke: mainTheme.colorPalette.primary, icon: CharavonRight, toggle: false, RightIcon: true, isIconRight: true, Lefticon: Groupby, LeftIcon: true, isIconLeft: true },
    { id: "Columns", name: "Columns", stroke: mainTheme.colorPalette.primary, toggle: false, icon: CharavonRight, toggle: false, RightIcon: true, isIconRight: true, Lefticon: Groupby, LeftIcon: true, isIconLeft: true },
    // {id:"edit",name:"Edit Dashboard" ,stroke:mainTheme.colorPalette.primary,icon:EditIcon,toggle: false,color:"#0F6FFF",RightIcon:true},

  ]
  const [menuOptions, setmenuOptions] = useState(menuOption)


  useEffect(() => {
    setGroupByOptions(groupByConfig[props.groupBy])
  }, [props.groupBy])


  useEffect(() => {
    if(props.defaultGrouping !== null && props.defaultGrouping !== undefined){
      handleGroupOptionClick(props.defaultGrouping,true)
    }
  },[props.defaultGroupingEnable])

  useEffect(() => {
    if (groupByConfig[props.groupBy]) {

      const filteredGroupByOptions = groupByConfig[props.groupBy].filter(
        (group) =>
          group.id === "" ||
          visibleheadCells.some((cell) => cell.id === group.id && cell.display !== "none")
      );

      setGroupByOptions(filteredGroupByOptions);
    }
  }, [props.groupBy, visibleheadCells]);


  // console.log("props.rawdata",props.rawdata)
  const processRawData = () => {
    if (props.rawdata && Array.isArray(props.rawdata)) {
      let dataModify
      if (props.columnfilterdata) {
        dataModify = props.columnfilterdata.map(r=> {{return {...r,checked:true}}})
      } else {
        dataModify = props.rawdata.map(r=> {{return {...r,checked:true}}})
      }
      if (Array.isArray(props.rawdata) && props.rawdata.length > 0 && props.rawdata[0]?.check_aggregate_window_function) {
        dataModify = props.rawdata.map(x => ({
          Name: x.name,
          alertType: x.alertType ? x.alertType : "",
          EntityName: (x.viid && x.virtual_instrument) ? x.virtual_instrument.name : x.instrument_id == 0 ? x.gateway_name : x.instrument_name,
          Parameter: x.instruments_metric ? x.instruments_metric.metric ? x.instruments_metric.metric.title : "" : "",
          WarningCheck: x.warn_type ? x.warn_type : "",
          WarningValue: x.warn_value ? x.warn_value : "",
          WarningMinimum: x.warn_min_value ? x.warn_min_value : "",
          WarningMaximum: x.warn_max_value ? x.warn_max_value : "",
          Warningfrequency: x.warn_frequency ? x.warn_frequency : "",
          Criticalfrequency: x.cri_frequency ? x.cri_frequency : "",
          CriticalCheck: x.critical_type ? x.critical_type : "",
          CriticalValue: x.critical_value ? x.critical_value : "",
          CriticalMinimum: x.critical_min_value ? x.critical_min_value : "",
          CriticalMaximum: x.critical_max_value ? x.critical_max_value : "",
          Aggergation: x.check_aggregate_window_function ? x.check_aggregate_window_function : "",
          Duration: x.check_aggregate_window_time_range ? x.check_aggregate_window_time_range : "",
          alert_channel_names: x.alert_channel_names ? x.alert_channel_names : "",
          Recurringalarm: x.recurring_alarm ? "Yes" : "No",
          User: x.userByUpdatedBy && x.userByUpdatedBy.name ? x.userByUpdatedBy.name : '',
          checked: true

        }));
      }

      setProcessData(dataModify)
      // setTemRawData(dataModify)Thad
      return dataModify;
    }
    else {
      return []
    }

  };

 




  // useEffect

  const classes = {
    ellipsis: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: "200px"
    },
    tableCell: {
      overflow: "ellipsis",
      color:
        curTheme === "dark"
          ? theme.colorPalette.darkSecondary
          : theme.colorPalette.secondary,
    },
    actionIcon: theme.actionIcons,
  }

  useEffect(() => {

    // const visibleColumns = visibleheadCells
    //   .filter(h => !h.display || h.display === "block")
    //   .map(h => h.id);


    const visibleColumns = props.groupBy?.includes('analytics') 
      ? visibleheadCells
        .filter((z) => z.display !== 'none')
        .map(h => h.label)
      : visibleheadCells
        .filter(h => !h.display || h.display === "block")
        .map(h => h.id);

    const filteredDownloadableData = downloadabledata.map(row =>
      Object.fromEntries(
        Object.entries(row).filter(([key]) => visibleColumns.includes(key))
      )
    );
    setfilteredDownloadableData(filteredDownloadableData)
  }, [visibleheadCells, downloadabledata, visibledata]);

  useEffect(() => {
    if (props.enableToggle && scrollState) {
      handlescrool()
    } else if (props.data.length > 0) {
      setscrollState(true)
    }
    setIscolChange(false)
  }, [props.data])

  const handlescrool = () => {
    setTimeout(() => {
      const element = document.getElementById("overalltablescroll")
      if (element) {
        element.scrollTo({
          left: 3457,
          behavior: 'smooth' // This enables smooth scrolling
        });
      }
    }, 1000)

  }
  useEffect(() => {
    setRowsPerPage(props.rowsPerPage ? props.rowsPerPage : 10)
  }, [props.rowsPerPage])

  useEffect(() => {
    setOrder(props.order ? props.order : "asc")
    setOrderBy(props.orderBy ? props.orderBy : "")

  }, [props.order, props.orderBy])

  useEffect(() => {
    setOpenAccordion(false)
  }, [props.closeAccordian])


  useEffect(() => {

    if (props.page) {
      setPage(props.page)
    }

    setSearch('');
  }, [props.page]);

  //   useEffect(() => {  
  //     setColumunOrder(props.data) 
  //    let pageSet = Math.ceil(parseFloat(props.count ? props.count :visibledata.length,rowsPerPage)/rowsPerPage)

  // if(pageSet > page){
  //  console.log("pageSet > page",pageSet > page)
  //  setPage(page ? page-1 : page)
  // }

  //    },  [props.data ])


  useEffect(() => {

    // setColumunOrder(ColumunOrder.length > 0 ? ColumunOrder : props.data)
    if ((ColumunOrder.length === props.data.length) && ColumunOrder.length > 0) {
      const array2Strings = props.data.map(row => JSON.stringify(row));
      const equalRows = ColumunOrder.filter((row,i) =>
        array2Strings[i].includes(JSON.stringify(row))
      );
      if( !IscolChange){
        setColumunOrder(props.data)
      }else{
        setColumunOrder(ColumunOrder)
      }
      // console.log(equalRows,"equalRows",ColumunOrder,props.data,IscolChange)
      // setIscolChange(false)
    }
    else {
      const array2Strings = props.data.map(row => JSON.stringify(row));
      const equalRows = ColumunOrder.filter(row =>
        array2Strings.includes(JSON.stringify(row))
      );
      setColumunOrder(ColumunOrder > 0 ? equalRows : props.data)
    }

    let pageSet = Math.ceil(parseFloat(props.count ? props.count : visibledata.length, rowsPerPage) / rowsPerPage)

    if ((pageSet) === page) {
      if (pageSet > 0 && handlefinalrows().length === 0) {
        setPage(page ? page - 1 : page)
      }
    }



  }, [props.data, visibledata])



  useEffect(() => {
    setSearch('')
  }, [props.name])



  useEffect(() => {
    let tempheadCells = [...props.headCells];
    if (props.actionenabled) {
      tempheadCells.push({
        id: "actions",
        numeric: false,
        disablePadding: false,
        label: props.statusUpdate ? t("Status") : t("Actions"),
      });

    }
    if (props.collapsibleTable || props.rowSelect) {
      tempheadCells.unshift({
        id: 'ExpandOrCollapse',
        numeric: false,
        disablePadding: true,
        label: '',
        display: 'block'
      },)
    }

    let visibleCells = props.actionenabled ? tempheadCells : tempheadCells.filter(x => x.id !== 'actions');

    getVisibleCells(visibleCells)
    setvisibleheadCells(visibleCells);
    setselectedcolnames(visibleCells.filter(f => !f.hide))

    // if(props.colfilterOption){
    //   props.colfilterOption(visibleCells) 
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.headCells, props.actionenabled]);



  const getVisibleCells = (visibleCells) => {
    let withoutHideCelss = visibleCells
      .filter((c) => !c.hide && c.label && c.id !== 'actions')
      .map((c) => ({
        ...c,
        // checked: props.defaultvisibleColumn && c.display==="none"? false : true,
        checked: c.display==="none"? false : true,
      }));

    setShowLabel(withoutHideCelss);
    setSelectedValue(withoutHideCelss)
    setOptionArray(withoutHideCelss);
    setSearchArray(withoutHideCelss)

  }

  const handleDownloadClick = (e) => {
    setopendownlist(true)
    setAnchorPossDown({ e: e, Target: e.currentTarget })
  }


  const rowsFormat = (arr, key) => {
    return arr.map((val) => {
      let obj = {};
      key.forEach((k, i) => {
        if(k !== undefined){
          obj[k] = val[i]
        }
      });

      return obj;
    })
  }

  const createrows = (data) => {
    
    let hiddenCol = visibleheadCells.filter((z) => z.display === 'none')?.map((col) => col.label)
    let spanR = props.spanRows?.map((x) => {
      if(!hiddenCol.includes(x.key)){
        return x
      } 
    })
    const keys = props.colSpan ? spanR.map((key) => key?.key) : visibleheadCells.filter(h => h.id !== "actions" && h.id !== "ExpandOrCollapse").map((key) => key.id);
    let rows = [];
    if (data.length > 0) {
      rows = [].concat(rowsFormat(data, keys));
    }
    return rows;
  };

  const createdownloadablerows = () => {
    let keys = []
    // eslint-disable-next-line array-callback-return
    let finalHeadCell = props.downloadHeadCells ? props.downloadHeadCells : visibleheadCells.filter(h => h.id !== "actions" && h.id !== "ExpandOrCollapse" && h.id !== "id");
    
    finalHeadCell.forEach((key) => {
      if (key.display !== "none") keys.push(key.id)
    })
    let rows = [];
    if (props.downloadabledata && props.downloadabledata.length > 0) {
      rows = [].concat(rowsFormat(props.downloadabledata, keys));
    }
    // console.log(finalHeadCell,"finalHeadCell",rows)
    return rows.map(m => {
      let Lablearr = []
      let keyVal = []
      Object.keys(m).forEach(f => {

        Lablearr.push(finalHeadCell.filter(h => h.id === f)[0].label)
        keyVal.push(finalHeadCell.filter(h => h.id === f)[0].id)
      })
      let obj = {}
      Lablearr.forEach((x, i) => {
        obj[x] = m[keyVal[i]]
      })

      return obj
    })


  }


  const createDownloadOriginalrows = (data) => {
    // console.clear()
    let hiddenCol = props.headCells?.map((col) => col.label)
    let spanR = props.spanRows.filter(h => h.key !== "actions")?.map((x) => {return x})
    // console.log(props.spanRows, spanR)
    const keys = props.colSpan ? spanR.map((key) => key?.key) : visibleheadCells.filter(h => h.id !== "actions" && h.id !== "ExpandOrCollapse").map((key) => key.id);
    let rows = [];
    // console.log(props.colSpan, keys)
    if (data.length > 0) {
      rows = [].concat(rowsFormat(data, keys));
    }
    // console.log(rows)
    return rows;
  };



  useEffect(() => {
    if (visibleheadCells.length > 0 && props.data.length > 0) {
      // let rows = createrows(props.data);
      let rows = props.groupBy?.includes('analytics') ? createDownloadOriginalrows(props.data) : createrows(props.data);
      setoriginaldatadownload(rows)
    }

  }, [props.data, visibleheadCells]);

  useEffect(() => {
    // console.log(props.rawdata,"props.actionenabled",props.data)
    if (visibleheadCells.length > 0 && ColumunOrder.length > 0 && props.rawdata.length) {
      let rows = createrows(ColumunOrder);
      let tempvisibledata = [...rows]
      if (props.actionenabled && props.actionenabled !== undefined) {
        tempvisibledata = tempvisibledata.map((row, index) => {
          return Object.assign({}, row, {
            action: !row.isActionEnable ? <RenderActionButton value={props.rawdata[index]} data={props.data[index]} id={index} /> : '',
            // actions: !row.isActionEnable ? <RenderActionButton value={props.rawdata[index]} data={props.data[index]} id={index} /> : '',
          });
        });

      }


      setCompleteTableData(tempvisibledata);
      // setOptimiseTableData(tempvisibledata)
      setvisibledata(tempvisibledata);
      let AllOptions = []
      if (props?.rawdata?.length > 0) {
        props.headCells.map(h => {
          const uniqueArray = [...new Set(processRawData().map(item => item[h.id]))];

          // const findColumn = ColAllOption.length > 0 ? ColAllOption.filter(t=> t.id===h.id)[0] ? option :uniqueArray.map(value => ({ [h.id]: value, checked: true }));


          const findColumn = ColAllOption.length > 0 && ColAllOption.filter(t => t.id === h.id)[0]?.option
            ? ColAllOption.filter(t => t.id === h.id)[0].option
            : uniqueArray.map(value => ({ [h.id]: value, checked: true }));

          AllOptions.push({
            ...h,
            option: findColumn,
            optionsrh: findColumn,
            rawOption: processRawData(),
            rawData: processRawData(),
            DefOption: uniqueArray.map(value => ({ [h.id]: value, checked: true })),
            overAllTabData: tempvisibledata
          })

        });

        setColAllOption(AllOptions)
      } else {
        setColAllOption([])
      }

    } else {
      setColAllOption([])
      setCompleteTableData([])
      setvisibledata([]);
      setOptimiseTableData([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ColumunOrder, openIndex.length, visibleheadCells, props.actionenabled, isshowbutton, props.rawdata]);


  useEffect(() => {
    // // console.log(props.actionenabled,"props.actionenabled")
    if (visibleheadCells.length > 0 && ColumunOrder.length > 0) {
      let rows = createrows(ColumunOrder);
      // // console.log(rows, "rearangerows",visibleheadCells)
      let Keys = visibleheadCells.filter(f => f.id !== 'actions' && f.id !== 'ExpandOrCollapse').map((k) => k.id)
      let downData = downloadabledata.map(d => {
        let ob = {}
        Keys.map(v => ob[v] = d[v])
        return ob
      })
     
      // setDownloadabledata(downData)
      // console.log(createdownloadablerows(),"createdownloadablerows()")
      props.downloadabledata ? setDownloadabledata(createdownloadablerows()) : setDownloadabledata(rowCheckedId.length ? downData : rows);



    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ColumunOrder, openIndex.length, visibleheadCells, props.actionenabled, rowCheckedId]);

  const handleClick = (event) => {
    // console.log("event",event)
    setOpen(!open)
    setAnchorPoss(event.currentTarget)
    event.stopPropagation()
  };

  const onClose = (event) => {
    setOpen(false);
    setAnchorPoss(null)
    event.stopPropagation();
  }

  const getNestedValues = (data, values) => {
    if (!(data instanceof Array) && typeof data == "object" && data) {
      Object.values(data).forEach((value) => {
        if (typeof value === "object" && !(value instanceof Array)) {
          getNestedValues(value, values);
        } else {
          values.push(value);
        }
      });
    }
    return values;
  };
  const calculateData = (datas, searchval) => {
    let visibleTemp
    let filteredData = []
    ColAllOption.map(h => {
      let array = [];
      let filterChecked = h.option.filter(x => !x.checked);

      filterChecked.forEach(item => array.push(item[h.id]));

      visibleTemp = filteredData.length > 0 ? filteredData : h.overAllTabData;

      if (array.length || h.option.some(x => x.checked)) {
        filteredData = visibleTemp.filter(x => {
          let value = x[h.id];

          if (value && typeof value === "object" && value.props && value.props.name) {
            value = value.props.name;
          }

          return !array.includes(value);
        });
      }
    });

    let data = filteredData
    let filData = [];
    if (searchval !== "") {
      filData = data.filter((item) => {
        let values = getNestedValues(item, []);
        return values.some(function (val) {
          return String(val).toLowerCase().includes(searchval.toLowerCase());
        });
      });
      setvisibledata(filData);
    } else {
      setvisibledata(data);
      return data;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(
    () => calculateData(completeTableData, props.SearchValue ? props.SearchValue : search),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completeTableData, props.SearchValue ? props.SearchValue : search]
  );

  function handlestatus(e, val, id) {
    if (e.target) {
      props.statusChange(e.target.value, val, id)
    }
  }

  const filterVisibleCol = (OptionArray) => {
    const value = OptionArray?.filter(x => x.checked)?.map(x => x.id);

    let newCell = []
    visibleheadCells?.forEach(p => {
      let index = value?.findIndex(v => p.id === v);
      const newDisplayValue = (index >= 0) ? 'block' : 'none';
      newCell.push({ ...p, display: (p.id === "ExpandOrCollapse" || p.id === 'actions') ? 'block' : newDisplayValue });
    });
    // setIscolChange(true)
    setvisibleheadCells(newCell)


  }



  function handlePopClose() {
    setColumnFilterOpen(false);
    // setAnchorE2(null);
    filterVisibleCol(OptionArray)

    setColumnGroupOpen(false);
    setAnchorE3(null);
  }



  const RenderActionButton = (restaction) => {
    const { value, id, data } = restaction
    const [increment, setincrement] = useState(value && value.increment ? value.increment : 0);
    const [customval, setcustomval] = useState(false);
    let calcBtn = (value && value.calculations && value.calculations.length > 0) ? t("View Calculations") : t("Add Calculations")

    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>

        {props.statusUpdate && value && (
          <React.Fragment>

            {value.status === 3 && (
              <span style={{ background: '#42af4252', fontSize: '13px', padding: '2px 5px', borderRadius: '4px' }}>
                {t("Completed")}
              </span>
            )}

            {value.status === 2 && (
              <span style={{ background: '#da1e2866', fontSize: '13px', padding: '2px 5px', borderRadius: '4px' }}>
                {t("Declined")}
              </span>
            )}

            {(value.status !== 2 && value.status !== 3) && (
              <div style={{ width: '150px' }}>
                <SelectBox
                  labelId="Status-update"
                  label=""
                  defaultDisableName=""
                  id="Status-update"
                  auto={false}
                  multiple={false}
                  options={props.StatusOption}
                  isMArray={true}
                  value={value.status ?? 1}
                  onChange={(e) => handlestatus(e, value, id)}
                  keyValue="name"
                  keyId="id"
                />
              </div>
            )}

          </React.Fragment>
        )}

        {
          props.actionButton &&
          <Button
            type='ghost'
            value={props.actionButton}
            onClick={(e) => { props.ActionButtonClick(id, value, e) }}
          />
        }

        {props.enableIncrement &&
          <div style={{ display: "flex", alignItems: 'center',width: '110px' }}>
            <Left style={{ cursor: 'pointer' }} id={'moveleft-' + (value && value.Partnum ? value.Partnum : 0)} onClick={() => {
              if (customval) {
                props.clickLeft(value, customval)
              } else {
                props.clickLeft(value, 1)
              }
              setcustomval(false)
            }} />
            <div style={{width: '60px'}}>
              <CustomTextField
                placeholder={t("Enter Value")}
                id={"inptut" + (value && value.Partnum ? value.Partnum : 0)}
                type="number"
                defaultValue={1}

                value={increment}
                onChange={(e) => {
                  setincrement(e.target.value)
                  let calc
                  if (value.increment > e.target.value) {
                    calc = value.increment - e.target.value
                  } else {
                    calc = e.target.value - value.increment
                  }
                  setcustomval(calc)
                }}
              />
            </div>
            <Right style={{ cursor: 'pointer' }} id={'moveright-' + (value && value.Partnum ? value.Partnum : 0)} onClick={() => {
              if (customval) {
                props.clickRight(value, customval)
              } else {
                props.clickRight(value, 1)
              }
              setcustomval(false)
            }}
            />
          </div>
        }

        {props.downloadBtn ? (
          <Download
            stroke={"#007BFF"}
            id={"download-" + value}
            onClick={(e) => {
              props.handleDownload(id, value, e);
            }}
          />
        ) : (
          ""
        )}
        {props.enableToggle && (
          <Checkboxs
            id={"switch-" + value}
            onChange={() => { props.handleToggle(value); handlescrool() }}
            checked={value?.enable ?? false}
            switch={true}
            size="small"
          />
        )}
        {props.enableHistory && (
          <History
            stroke={(props.disablededit && props.disablededit.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#007BFF"}
            cursor={"pointer"}
            id={"edit-instrument-" + value}
            onClick={() => props.enableHistory(id, value)}
          />
        )}
        {props.enableAdd && (
          <PlusIcon
            stroke={curTheme === 'dark' ? '#ffff' : '#000000'}
            style={{ paddingRight: 5 }}
            id={"Add-instrument-" + value}
            cursor={"pointer"}
            onClick={() => {
              props.handleAdd(id, value);
            }}
          />
        )}
        {props.handleCreateDuplicate && (
          <DuplicateIcon
            stroke={(props.disabledDuplicate && props.disabledDuplicate.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#007BFF"}
            id={"edit-instrument-" + value}
            cursor={"pointer"}
            onClick={(e) => {
              if (!(props.disabledDuplicate && props.disabledDuplicate.findIndex(i => i === id) >= 0))
                props.handleCreateDuplicate(id, value, e);

            }}
          />

        )
        }
        {props.enablenotification && value && value.status === "Inactive" &&
          <Button type="ghost" value={"Send Notification"} style={{ width: "150px" }}
            disabled={isshowbutton}
            onClick={() => props.handlenotificationClick(value)} />}
        {props.enablenotification && value && value.status === "Active" &&
          <Button type="ghost" value={"Send Notification"} style={{ width: "150px" }}
            disabled={true} />}
        {
          props.enableViews && (

            <EyeView
              stroke={(props.disabledView && props.disabledView.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#007BFF"}
              id={"View-instrument-" + value}
              cursor={"pointer"}
              onClick={(e) => {
                if (!(props.disabledView && props.disabledView.findIndex(i => i === id) >= 0))
                  props.handleViews(id, value, e);

              }}
            />
          )
        }
        {!props.tasktable && props.enableview && (
          <Button value="View more" type="ghost" style={{ width: "100px" }} onClick={() => {
            props.handleview(id, value);
          }}> </Button>
        )}
        {props.tasktable && props.enableview && (
          <Button value="View" type="ghost" style={{ width: "100px" }} onClick={() => {
            props.handleview(id, value);
          }}> </Button>
        )}
        {props.enabletrend && (
          <Tooltip title={"View Trend"} placement="bottom" arrow>
            <Button type="ghost"
              icon={Trend}
              disabled={value?.virtualInstrumentId ? true : false}
              onClick={() => {
                props.handletrend(id, value);
              }}> </Button>
          </Tooltip>
        )}
        {props.enabletask && (
          <Tooltip title={"Create Task"} placement="bottom" arrow>
            <Button type="ghost"
              disabled={value && (value.acknowledgeID === null || value.acknowledge_id === null || (value.virtualInstrumentId ? true : false) || props.disabletask || (data && data[1] === "-" ? true : false))}
              icon={Plus}
              style={{ width: "32px", height: "32px" }}
              onClick={() => {
                props.handletask(id, value);
              }}> </Button>
          </Tooltip>
        )}

        {
          props.testConnection &&
          (
            props.clickedIndex && props.clickedIndex.loader && props.clickedIndex.id === id ?
              <ProgressIndicatorNDL />
              :
              <TestConnection
                stroke={props.clickedIndex && props.clickedIndex.loader ? "#c4c4c4" : "#007BFF"}
                id={"edit-instrument-" + value}
                cursor={"pointer"}
                onClick={(e) => {
                  if (!(props.clickedIndex && props.clickedIndex.loader))
                    props.handleTestConnection(id, value, e);

                }}
              />
          )
        }

        {props.enableEdit && (
          <Edit

            stroke={(props.disablededit && props.disablededit.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#007BFF"}
            id={"edit-instrument-" + value}
            cursor={
              props.disablededit && props.disablededit.findIndex(i => i === id) >= 0
                ? "not-allowed"
                : "pointer"
            }
            onClick={(e) => {
              if (!(props.disablededit && props.disablededit.findIndex(i => i === id) >= 0))
                props.handleEdit(id, value, e);

            }}
          />
        )}
        {props.enableView && (
          <Eye
            id={"view-instrument-" + value}
            stroke={(props.disabledView && props.disabledView.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#007BFF"}
            cursor={"pointer"}
            onClick={() => {
              props.handleView(id, value);
              setGroupBy('')
            }}
          />
        )}
        {props.enableviewmore && (
          <Button
            type={"ghost"}
            value={"View More"}
            onClick={() => {
              props.handleviewmore(id, value);

            }}

          />
        )}
        {props.enabletasks && (
          <Tooltip title={"Create Task"} placement="bottom" >
            <Button
              type={"ghost"}
              style={{ width: '32px', height: '32px' }}
              icon={Plus}
              onClick={() => {
                props.handletasks(id, value);

              }}

            />
          </Tooltip>
        )}
        {props.enablefft && (
          <Tooltip title={"View FFT"} placement="bottom" >
            <Button
              type={"ghost"}
              style={{ width: '32px', height: '32px' }}
              icon={FFT}
              onClick={() => {
                props.handlefft(id, value);

              }}

            />
          </Tooltip>
        )}
        {props.enabletrends && (
          <Tooltip title={"View Trend"} placement="bottom" >
            <Button
              type={"ghost"}
              style={{ width: '32px', height: '32px' }}
              icon={Trend}
              onClick={() => {
                props.handletrends(id, value);

              }}

            />
          </Tooltip>
        )}
        {props.enableDelete && (
          <Delete
            style={classes.actionIcon}
            stroke={renderDeleteDisable(id, value) === 1 ? "#c4c4c4" : "#FF0D00"}
            id={"delete-instrument-" + value}
            cursor={renderDeleteDisable(id, value) === 1 ? undefined : "pointer"}
            onClick={(e) => {
              if (renderDeleteDisable(id, value) === 0)
                props.handleDelete(id, value, e);

            }}
          />
        )}
        {props.customAction &&
          (Array.isArray(props.customAction) ?
            props.customAction.map((actionbutton) => {
              return (
                <Tooltip title={actionbutton.name} placement="bottom" arrow>
                  <actionbutton.icon stroke={actionbutton.stroke} style={{ cursor: 'pointer' }} id={'Locate-'}
                    onClick={() => {
                      actionbutton.customhandle(value)
                    }}
                  />
                </Tooltip>
              )
            })
            :
            <Tooltip title={props.customAction.name} placement="bottom" arrow>
              <props.customAction.icon stroke={props.customAction.stroke} style={{ cursor: 'pointer' }} id={'Locate-'}
                onClick={() => {
                  props.customhandle(value)
                }}
              />
            </Tooltip>
          )
        }
        {props.enableButton && (
          <div style={{ marginLeft: 10 }}>
            <Button
              type={props.buttontype ? props.buttontype : "primary"}
              value={props.customBtn ? calcBtn : props.enableButton}
              color={props.buttoncolor}
              hoverColor={props.buttonhoverColor}
              icon={props.enableButtonIcon}
              disabled={props.disabledbutton.findIndex(i => i === id) >= 0 ? true : false}
              id={"view-instrument-" + value}
              onClick={() => {
                props.handleCreateTask(id, value);
              }}
              style={{ width: '150px' }}

            />
          </div>

        )
        }
        {props.ghostBtn && (
          <div style={{ marginLeft: 10 }}>
            <Button
              type={"ghost"}
              value={props.enableButton}
              disabled={props.disabledbutton.findIndex(i => i === id) >= 0 ? true : false}
              id={"view-instrument-" + value}
              onClick={() => {
                props.handleCreateTask(id, value);

              }}

            />
          </div>
        )
        }

      </div>
    );
  };


  const renderDeleteDisable = (id, value) => {
    if (props.disableDelete) {
      if (!('config' in value)) {
        return 1
      } else {
        return 0
      }
    } else {
      if ((props.disableddelete && props.disableddelete.findIndex(i => i === id) >= 0)) {
        return 1
      } else {
        return 0
      }

    }
  }

  useEffect(() => {
    if (rowCheckedId && rowCheckedId.length === 0) {
      setDownloadabledata(groupBy !== '' ? stableSort(visibledata, getComparator(order, orderBy)) : stableSort(visibledata, getComparator(order, orderBy)))
    }
  }, [visibledata, orderBy, rowCheckedId])

  const handlefinalrows = () => {
    if (page > 0 && !props.serverside) {
      return groupBy !== '' ? stableSort(visibledata, getComparator(order, orderBy)) : stableSort(visibledata, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return groupBy !== '' ? stableSort(visibledata, getComparator(order, orderBy)) : stableSort(visibledata, getComparator(order, orderBy)).slice(
        0 * rowsPerPage,
        0 * rowsPerPage + rowsPerPage
      );
    }

  };

// // console.log(handlefinalrows(),"handlefinalrows")

  const handleRequestSort = (event, property) => {

    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    if (props.rowPerPageSustain) {
      let isasc = props.order === "asc"
      props.onPageChange(page, rowsPerPage, { ...props.TableSustainValue, order: isasc ? "desc" : "asc", orderby: property })
    }
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    filterVisibleCol(OptionArray)
    setPage(newPage);

    if ((props.rejected || props.rowsPerPage) && props.rowPerPageSustain && props.TableSustainValue) {
      props.onPageChange(newPage, rowsPerPage, props.rowPerPageSustain && !props.serverside ? { ...props.TableSustainValue, page: newPage, rowperpage: props.TableSustainValue.rowperpage } : {})

    } else if (props.rowsPerPage) {
      props.onPageChange(newPage, rowsPerPage)
    }

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);

    if (props.rejected || props.rowsPerPage) {
      props.onPageChange(0, event.target.value, props.rowPerPageSustain ? { ...props.TableSustainValue, page: 0, rowperpage: parseInt(event.target.value, 10) } : {})
    }
  };

  function reArrangeCol(colarr, key) {
    let colOrder = props.rowSelect ? colarr.filter(f => f).map(c => c - 1) : colarr;
    let NewData = ColumunOrder.map(v => colOrder.map(id => v[id]));
    setIscolChange(true)
    setColumunOrder(NewData)
  }




  const SortableContainer = sortableContainer(({ children }) => {
    return <tbody>

      {children}</tbody>;
  });

  // const SortableAccordianContainer = sortableContainer(({ children }) => {
  //   return <div>

  //     {children}</div>;
  // });


  const DragHandle = sortableHandle(() => <DragIcon height={16} width={16} style={{ cursor: "pointer" }} />);


  // useEffect(()=>{
  // // console.log(page,rowsPerPage)
  // },[page,rowsPerPage])
  const onSortEnd = ({ oldIndex, newIndex }) => {
    // let newIdx = []
    // // // console.log(oldIndex,newIndex,"oldIndex,newIndex")
    // for (let i = 0; i < visibledata.length; i++) {
    //   if (oldIndex === i) {
    //     newIdx.push(newIndex)
    //   } else if (newIndex === i) {
    //     newIdx.push(oldIndex)
    //   } else {
    //     newIdx.push(i)
    //   }
    // }
    // let NewData = newIdx.map(v => visibledata[v])
    // let ColData = newIdx.map(v => ColumunOrder[v]);
    const NewData = arrayMoveImmutable(visibledata, oldIndex, newIndex);
    const ColData = arrayMoveImmutable(ColumunOrder, oldIndex, newIndex);

    setColumunOrder(ColData)
    setIscolChange(true)
    setCompleteTableData(NewData)
    setvisibledata(NewData)

  };


  useEffect(() => {
    if (props.handleupdatedData && typeof props.handleupdatedData === "function") {
      if (props.ackmultiselect || updatedData.length > 0) {
        props.handleupdatedData(updatedData);
      }
    }

    if (props.enablenotification || updatedData.length > 0) {
      const hasActiveStatus = updatedData.some(
        (item) => item.Status?.props?.children?.props?.name === "Active"
      );

      if (hasActiveStatus) {
        setisshowbutton(false);
      } else {
        const inactiveCount = updatedData.filter(
          (item) => item.Status?.props?.children?.props?.name === "Inactive"
        ).length;
        setisshowbutton(inactiveCount >= 2);
      }
    } else {
      setisshowbutton(false);
    }
  }, [updatedData]);

  const handleCheckChange = (e, row) => {
    const alertid = row;

    let existChecked = [...rowCheckedId];
    let isChecked = existChecked.findIndex(a => a[props.checkBoxId] === alertid[props.checkBoxId]);
    if (isChecked >= 0) {
      existChecked.splice(isChecked, 1);
    } else {
      existChecked.push(alertid);
    }

    const updatedData = existChecked.map(item => {
      const { action, id, ...rest } = item;
      return rest;
    });
    setRowCheckedId(existChecked);
    if (props.enablenotification || props.ackmultiselect) {
      setupdatedData(updatedData);
    }

    if (updatedData.length > 0) {
      setDownloadabledata(updatedData);
    } else {
      const rows = createrows(ColumunOrder);
      setDownloadabledata(rows);
    }

  };

 
  

  const SortableItem = sortableElement(({ row, visibleheadCells, props, index }) => (
   <>

      <tr
        className={` hover:bg-Background-bg-primary dark:bg-Background-bg-primary-dark ${index === handlefinalrows().length - 1 && props.hidePagination ? '' : ' border-b border-Border-border-50  dark:border-Border-border-dark-50'}`}
        // style={{ backgroundColor: curTheme === 'dark' ? '#000000' : props.backgroundColorChild ? props.backgroundColorChild : props.selectedTableCol === index ? "#E0E0E0" : row.color || '#ffff', color: curTheme === 'dark' ? 'dark gray' : undefined }}
        style={{ backgroundColor: rowCheckedId.map(x => x[props.checkBoxId]).includes(row[props.checkBoxId]) ? curTheme === "dark" ? '#313131' : "#E0E0E0" : props.isCustomWidget ? row.color : "" }}

      >

        {props.rowSelect && (
          <td>
            <div className="flex items-center pl-2">
              <DragHandle />
              <div className="ml-3">
                <Checkboxs checked={rowCheckedId.map(x => x[props.checkBoxId]).includes(row[props.checkBoxId])} onChange={(e) => handleCheckChange(e, row)} />
              </div>

            </div>


          </td>
        )}



        {props.collapsibleTable && (
          <td>

            <div
              className="pl-2"
              onClick={() => {
                setOpenAccordion(!openaccordion);
                setOpenIndex(row[props.checkBoxId]);
              }}
            >
              {openaccordion && row[props.checkBoxId] === openIndex
                ? (props.expandIcon ? <props.collapsibleIcon /> : <KeyboardArrowUpIcon />)
                : (props.collapsibleIcon ? <props.expandIcon /> : <KeyboardArrowDownIcon />)}
            </div>
          </td>
        )}


        {(props.colSpan ? props.spanRows : visibleheadCells)
          .filter((f) => f.id !== 'ExpandOrCollapse')
          .map((val, i) => (

            val.display !== 'none' && (
              <td
                key={val.id}
                className={`${props.isSpanRows && Array.isArray(Object.values(row)[i]) ? ""  :"Table-td-LR Table-td-Top"} text-[14px] text-Text-text-primary dark:text-Text-text-primary-dark leading-[16px] font-normal font-geist-sans ${props.breakAll && val.id === props.breakid ? 'break-all' : ''} ${props.isSpanRows ? "border-r border-Border-border-50 dark:border-Border-border-dark-50" : ""} `}
                align={val.align || 'left'}
                // style={{ color: row.textcolor }}
                style={{ color: row.textcolor, background: row?.color }}
              >
              {/* {console.log(Object.values(row)[i],row,i,"Object.values(row)[i]")} */}
                {
                  props.isSpanRows ?
                        Array.isArray(Object.values(row)[i]) ? 
                        Object.values(row)[i][0].map((item, idx) => (
                          <React.Fragment>
                    <tr className="Table-td-LR Table-td-Top" key={idx}>
                          <td className="pl-4">
                            {item === '0' ? "-" : item}
                          </td>
                        </tr>
                        {
                          Object.values(row)[i][0].length -1 !== idx  &&
                        <hr className="text-Border-border-50 dark:text-Border-border-dark-50"/>
                        }
                        </React.Fragment>
                        ))
                        :
                    <tr  >
                        <td rowSpan={row[props.arrayKey][0].length || 1} >
                            {Object.values(row)[i]}
                        </td>
                    </tr>
                  :
                <tr>
                  <td>
                    <div className="flex items-center" >



                      {Object.values(row)[i] && props.rejected && Object.values(row)[i].toString().includes('Rejected') ? (
                        <span>

                          <span style={{ color: 'red' }}>{Object.values(row)[i].split(',')[0]} ,</span>
                          {Object.values(row)[i].split(',')[1]}
                        </span>
                      ) : (

                        <span className="ml-2">{Object.values(row)[i]}</span>
                        // <span className="ml-2">HI</span>

                      )}
                    </div>
                  </td>
                </tr>

                }
                
              </td>

            )
          ))}


      </tr>
      {props.collapsibleTable && openaccordion && row[props.checkBoxId] === openIndex && (
        <tr>
          <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <div style={{ marginBottom: 10 }}>{props.GetCollapsibleRow(row, row[props.checkBoxId])}</div>
          </td>
        </tr>
      )}
    </>

  ))



  const handleRevertCheck = () => {
    setRowCheckedId([])
    setselectedDataDownload([])
    setupdatedData([])
  }

  const handleColChange = (e) => {
    const value = e.map(x => x.id);
    let newCell = []

    visibleheadCells.forEach(p => {
      let index = value.findIndex(v => p.id === v);
      const newDisplayValue = (index >= 0) ? 'block' : 'none';
      newCell.push({ ...p, display: (p.id === "ExpandOrCollapse" || p.id === 'actions') ? 'block' : newDisplayValue });
    });
    setvisibleheadCells(newCell)
    // setIsOptChg(true)
    // setheadCells(newCell);
    // setFilterColOption(newCell)
    setselectedcolnames(e);
    // setAlarmTableCustomization({ ...alarmTableCustomization, headCells: newCell, selectedColumns: e })
  }



  const ChangeVisibleHeadCells = (e, data, val) => {
    let selected = [...showLabel];
    let ExistIndex = selected.findIndex(x => x.id === e.id);
    if (ExistIndex > -1) {
      // Check already selected and remove

      selected.splice(ExistIndex, 1);
    } else {
      selected.push({ ...e, checked: !e.checked })
    }
    setSelectedValue(selected)
    if (props.maxSelect && props.maxSelect < selected.length) {
      return false
    }

    if (val) {
      let optarray = OptionArray.map(v => { //To Select and de-select the option
        return { ...v, checked: val.selectAll }

      })
      setSearchArray(optarray)
      setOptionArray(optarray)
      setSelectedValue(val.selectAll ? optarray : [])
    }

    else {
      let optarray = SearchArray.map(v => {
        //To Select and de-select the option
        if (e.id === v.id) {
          return { ...v, checked: !e.checked }
        } else {
          return v
        }
      })
      let Alloptarray = OptionArray.map(v => { //To Select and de-select the option
        if (e.id === v.id) {
          return { ...v, checked: !e.checked }
        } else {
          return v
        }
      });
      setOptionArray(Alloptarray)
      setSearchArray(optarray)
      setSelectedValue(selected)
    }

  };

  const handleMenu = () => {
    setOpenMenu(!openMenu)
  }

  const handleNullPopper = (e) => {
    setOpenMenu(!openMenu)
    // setAnchorPos(e.currentTarget)
    setAnchorPos({ e: e, Target: e.currentTarget })
  }

  const handleClose = () => {
    setOpenMenu(!openMenu)
    setAnchorPos(null)
  };

  const handleDownClose = () => {
    setopendownlist(!opendownlist)
    setAnchorPossDown(null)
  };



  const handleClick2 = (event) => {
    setColumnFilterOpen(true);
    setAnchorE2({ e: event, Target: event.currentTarget });
  };

  const handleClick3 = (event) => {
    setColumnGroupOpen(true);
    setAnchorE3({ e: event, Target: event.currentTarget });

  };

  const handleGroupOptionClick = (e,isauto) => {
    setselectedgroupby(e)
    //console.clear()
    let availableValue = []
    let uniqueValue = []
    // handlefinalrows().map((x) => availableValue.push(x[e]))
    visibledata.map((x) => availableValue.push(x[e]))
    
    uniqueValue = [...new Set(availableValue)].sort((a, b) => a.localeCompare(b))
    const table_columns = Object?.keys(handlefinalrows()?.[0])
    const filteredColumns = table_columns.filter(col =>
      col === "action" || visibleheadCells.some(cell => cell.id === col && cell.display !== "none")
    );
    setTableColumns(filteredColumns);
    setGroupBy(e);
    handlePopClose()
    setOpenMenu(!openMenu)
    setAccordians(uniqueValue)
    let accord_open = {}
    if(isauto){
      uniqueValue.map((zi) => { accord_open[zi] = true })
    }else{
      uniqueValue.map((zi) => { accord_open[zi] = false })

    }
    setAccodianOpen(accord_open)
  }

  const handleAccordianOpenClose = (val) => {
    let accord_open = accodianOpen
    accord_open[val] = !(accord_open[val])
    setAccodianOpen(accord_open)
  }

  function TableMenu({ curTheme }) {
    // console.clear()
    return (
      <div
        id="profile-menu"
        className={`z-20 bg-Background-bg-primary rounded-md w-60 ${curTheme === "dark" ? "dark:bg-gray-700" : "bg-white"
          }`}
        style={{
          position: "absolute",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          top: "17%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ul
          className="h-auto p-3 text-sm rounded-lg text-gray-700 dark:text-gray-200 mb-0"
          style={{
            backgroundColor: curTheme === "dark" ? "#282929" : "#FCFCFC",
          }}
          aria-labelledby="dropdownSearchButton"
        >
          <React.Fragment>
            <li
              id="language-list"
              value="Language"
              className={`flex justify-between items-center rounded p-2 ${curTheme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
              style={{ cursor: "pointer" }}
              onClick={(event) => handleClick2(event)}
            >
              <div className="flex gap-2 items-center">
                <Column />
                <TypographyNDL
                  variant="label-01-s"
                  style={{ color: curTheme === "dark" ? "#FFF" : "#000" }}
                  value={"Columns"}
                />
              </div>
              <CharavonRight />
            </li>
            <ListNDL
              options={SearchArray}
              AllOption={OptionArray}
              Open={columnFilterOpen}
              optionChange={(e, data, val) => ChangeVisibleHeadCells(e, data, val)}
              keyValue={"label"}
              keyId={"id"}
              id={"lang-menu"}
              onclose={handlePopClose}
              anchorEl={anchorE2}
              width="200px"
              selectAll={true}
              selectedOpt={selectedValue}
              selectAllText={"Select All"}
              multiple={true}


            />
            <HorizontalLine variant="divider1" />
            {
              props?.groupBy !== '' && <>
                <li
                  id="language-list"
                  value="Language"
                  className={`flex justify-between items-center rounded p-2 ${curTheme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"
                    }`}
                  style={{ cursor: "pointer" }}
                  // Uncomment and implement if needed
                  onClick={(e) => handleClick3(e)}
                >
                  <div className="flex gap-2 items-center">
                    <Groupby />
                    <TypographyNDL
                      variant="label-01-s"
                      style={{ color: curTheme === "dark" ? "#FFF" : "#000" }}
                      value={"Groupby"}
                    />
                  </div>
                  <CharavonRight />
                </li>
                <ListNDL
                  options={groupByOptions}
                  AllOption={groupByOptions}
                  Open={columnGroupOpen}
                  optionChange={(e, data, val) => { handleGroupOptionClick(e) }}
                  keyValue={"label"}
                  keyId={"id"}
                  id={"lang-menu"}
                  onclose={handlePopClose}
                  anchorEl={anchorE3}
                  width="200px"
                  selectAll={false}
                  selectedOpt={selectedValue}
                  selectAllText={"Select All"}
                  multiple={false}
                />
                <HorizontalLine variant="divider1" />
              </>}
            <li
              id="language-list"
              value="Language"
              className={`flex justify-between items-center rounded p-2 ${curTheme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
              style={{ cursor: "pointer" }}
            // Uncomment and implement if needed
            // onClick={handleClick2}
            >
              <div className="flex gap-2 items-center">
                <Sortby />
                <TypographyNDL
                  variant="label-01-s"
                  style={{ color: curTheme === "dark" ? "#FFF" : "#000" }}
                  value={"Sortby"}

                />
              </div>
              <CharavonRight />
            </li>
            <HorizontalLine variant="divider1" />

          </React.Fragment>
        </ul>
      </div>
    );
  }


  const Accordion = ({ title, children, length }) => {
    const [isOpen, setIsOpen] = useState(accodianOpen[title] || false);

    const changeState = () => {
      let arr = accodianOpen
      arr[title] = !isOpen
      setIsOpen(!isOpen)
      setAccodianOpen(arr)
    }

    return (
      <>
        <tr
          style={{ cursor: "pointer", width: '100%', borderBottomColor: '#E5E7EB', borderBottomWidth: isOpen ? '0px' : '1px' }}
          onClick={() => changeState()}
        >
          <td colSpan="3" style={{ padding: "10px", fontWeight: "500" }}>
            {isOpen ? <CheravonUp stroke="#646464" /> : <CheravonDown stroke="#646464" />} &nbsp;<span className="text-Text-text-primary dark:text-Text-text-primary-dark text-sm font-geist-sans font-normal">
              {title}
            </span> &nbsp;&nbsp; <span className="bg-Neutral-neutral-base dark:bg-Neutral-neutral-base-dark min-w-[33px]  text-Text-text-primary dark:text-Text-text-primary-dark  px-2 text-center py-1 font-geist-mono font-normal rounded-[12px] text-[14px] leading-[16px]">{length}</span>
          </td>
        </tr>
        {/* {isOpen && <SortableAccordianContainer onSortEnd={onSortEnd} useDragHandle >{children}</SortableAccordianContainer>} */}
        {isOpen && children}
      </>
    );
  };

  function optionChange(e, val) {
    if (e.val.id === "groupBy") {
      handleClick3(e.e);
    }
    else {
      handleClick2(e.e)
    }

  }

  const selectAll = () => {
    rowCheckedId.length === 0 ? setRowCheckedId(handlefinalrows()) : setRowCheckedId([])
  }


  return (
    <React.Fragment>
      {
        snackOpen && <LoadingScreen />
      }
      <div width={props.width ? props.width : undefined} height={props.height ? props.height : undefined} className="border bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50 rounded-2xl border-solid">

        {rowCheckedId.length !== 0 ?
          <div style={{ width: "200px", float: "left", display: "flex", alignItems: "center", marginLeft: "16px", margin: "10px" }} onClick={handleRevertCheck}>
            <Checkboxs checked={rowCheckedId.length && true} />
            <TypographyNDL variant="label-02-s" value={rowCheckedId.length + " " + "items Selected"} />
          </div> :
          <div className="flex float-left items-center py-2 px-4 pt-4" >
            {props.heading && <TypographyNDL  variant="heading-02-xs" color="secondary" model value={props.heading} />}
          </div>
        }
        <div className={`flex float-right items-center py-2 ${props.heading === 'Quality Details' ? '' : 'px-4'} gap-2`}>
          {props.search && (
            <TableSearch
              searchdata={(value) => {
                setSearch(value);
                setPage(0);
                if (props.onSearchChange) {
                  props.onSearchChange(value)
                }

                if (props.rejected) {
                  props.onPageChange(0, rowsPerPage)
                }
              }}
              search={props.rowPerPageSustain ? props.SearchValue : search}
            />
          )}
          {props.download &&
            selectedcolnames.length !== 0 && (
              <div>
                <TableDownload
                isSpanRows ={props.isSpanRows}
                  multitable={props.multitable}
                  tagKey={props.tagKey}
                  data={originaldatadownload}
                  filtereddata={filteredDownloadableData}
                  groupby={selectedgroupby}
                  headCells={visibleheadCells.filter(x => x.hide !== true || x.alternate === true)}
                  buildExcelDataAndMerges={props.buildExcelDataAndMerges}
                  buildExcelDataAndMergesGrouped={props.buildExcelDataAndMergesGrouped}
                  unFormatedData={props.unFormatedData}
                  downFileName={props.downFileName}
                />
              </div>
            )}
          {
            props.customIcon && <Button
              type={"ghost"}
              icon={props.customIcon}
              onClick={props.custIconActn}
            />
          }
          {/* {props.FilterCol &&
            <div style={{ width: "150px", }}>
              <SelectBox
                labelId="filter-column-alarm-rules"
                id="filter"
                placeholder={t("Select column")}
                disabledName={t("FilterColumn")}
                options={visibleheadCells.filter(c => !c.hide && c.label && c.id !== 'actions')}
                keyValue={"label"}
                keyId={"id"}
                // value={selectedcolnames.length === 16 ? selectedcolnames : alarmTableCustomization.selectedColumns && alarmTableCustomization.selectedColumns.length > 0 ? alarmTableCustomization.selectedColumns : selectedcolnames}
                value={selectedcolnames}
                multiple={true}
                onChange={(e, prop) => handleColChange(e, prop)}
                selectAll={true}
                selectAllText={"Select All"}

              />

            </div>
          } */}

          {props.buttonpresent && !props.enablenotification && (
            <div >
              <Button
                type={"tertiary"}
                value={props.buttonpresent}
                icon={props.Buttonicon}
                Righticon={props.isButtomRight}
                onClick={props.onClickbutton}></Button>
            </div>
          )}
          {props.enablenotification && isshowbutton && (
            <div >
              <Button
                type={"ghost"}
                value={props.buttonpresent}
                icon={props.Buttonicon}
                Righticon={props.isButtomRight}
                style={{ width: "150px" }}
                onClick={(value) => props.onClickbutton(updatedData)}
              >
              </Button>
            </div>
          )}
          {
            props.fileDownload && <Button
              type={"ghost"}
              icon={FileDownload}
              onClick={props.fileDownload}
            />
          }
          {
            props.fileUpload && <Button
              type={"tertiary"}
              value={t('Upload from file')}
              icon={FileUpload}
              onClick={props.fileUpload} />
          }

          {props.verticalMenu && (
            <div className="h-8">
              {/* <Button
                type={"ghost"}
                icon={VectorMenu}
                onClick={handleMenu}
              /> */}
              <Button icon={VectorMenu} type='ghost' onClick={(e) => handleNullPopper(e)} />
            </div>
          )}

          {/* {openMenu && (
            <TableMenu curTheme="null" />
          )} */}
          <ListNDL
            options={menuOptions}
            Open={openMenu}
            optionChange={(e, val) => optionChange(e, val)}
            isSubMenu={true} // to Enable Submenu 
            keyValue={"name"}
            keyId={"id"}
            id={"popper-Gap"}
            onclose={handleClose}
            IconButton
            isIconRight
            anchorEl={AnchorPos}
            width="170px"
            toggleChange={() => { alert("HIjj") }}
          />

          <ListNDL
            options={SearchArray}
            AllOption={OptionArray}
            Open={columnFilterOpen}
            optionChange={(e, data, val) => ChangeVisibleHeadCells(e, data, val)}
            subMenu={true}
            keyValue={"label"}
            keyId={"id"}
            id={"lang-menu"}
            onclose={handlePopClose}
            anchorEl={anchorE2}
            width="200px"
            selectAll={true}
            selectedOpt={selectedValue}
            selectAllText={"Select All"}
            multiple={true}


          />

          <ListNDL
            options={groupByOptions}
            AllOption={groupByOptions}
            Open={columnGroupOpen}
            optionChange={(e, data, val) => { handleGroupOptionClick(e) }}
            subMenu={true}
            keyValue={"label"}
            keyId={"id"}
            id={"lang-menu"}
            onclose={handlePopClose}
            anchorEl={anchorE3}
            width="200px"
            selectAll={false}
            selectedOpt={selectedValue}
            selectAllText={"Select All"}
            multiple={false}
          />
        </div>
        <div className="w-full">
          {
            groupBy === ''
              ? (<>
               <div className="overflow-x-auto w-full" id={"overalltablescroll"}>
                <table className="w-full text-sm text-left"  >
                  <EnhancedTableHeader
                  isSpanRows={props.isSpanRows}
                tagKey={props.tagKey} 
                    order={order}
                    orderBy={orderBy}
                    disableColDrag={props.disableColDrag}
                    onRequestSort={handleRequestSort}
                    rowCount={visibledata.length}
                    headCells={visibleheadCells}
                    visibledata={visibledata}
                    optimiseData={completeTableData}
                    colSpan={props.colSpan ? props.colSpan : undefined}
                    spanRows={props.spanRows ? props.spanRows?.map((x) => {
                      if(!visibleheadCells.filter((z) => z.display === 'none')?.map((col) => col.label).includes(x.key)){
                        return x
                      } 
                    }).filter((y) => y !== undefined) : undefined}
                    backgroundColorChild={props.backgroundColorChild}
                    OnheaderChange={(e, colarr) => {
                      setvisibleheadCells(e);
                      if (props.colfilterOption) {
                        props.colfilterOption(colarr)
                      }
                      reArrangeCol(colarr, e)
                    }}
                    // filterPopOpen={(e) => filterPopOpen(e, visibleheadCells)}
                    rowSelect={props.rowSelect}
                    setvisibledata={setvisibledata}
                    // handlefinalrows={handlefinalrows}
                    rawData={props.rawdata ? props.rawdata : []}
                    setDownloadabledata={setDownloadabledata}
                    ColAllOption={ColAllOption}
                    setColAllOption={setColAllOption}
                    processData={processData}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    groupBy={groupBy}
                  />

                    <SortableContainer onSortEnd={onSortEnd} useDragHandle >
                      {handlefinalrows().map((row, index) => {
                        const adjustedIndex = page * rowsPerPage + index
                        return (<SortableItem
                          key={`sortable-item-${adjustedIndex}`}
                          row={row}
                          visibleheadCells={visibleheadCells}
                          props={props}
                          index={adjustedIndex}
                        />)
                      })}
                    </SortableContainer>
                  </table>
                </div>

                {!props.hidePagination &&
                  <EnhancedTablePagination
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    visibledata={visibledata}
                    count={props.count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    PerPageOption={props.PerPageOption}
                    order={order}
                  />
                }
              </>)
              : (<>

                <div className="overflow-x-auto w-full">
                                <table style={{ width: "100%",  borderCollapse: "collapse" }}>
                                  <EnhancedTableHeader
                                tagKey={props.tagKey} 
                                isSpanRows={props.isSpanRows}
                                    order={order}
                                    orderBy={orderBy}
                                    disableColDrag={props.disableColDrag}
                                    onRequestSort={handleRequestSort}
                                    rowCount={visibledata.length}
                                    headCells={visibleheadCells}
                                    visibledata={visibledata}
                                    optimiseData={completeTableData}
                                    colSpan={props.colSpan ? props.colSpan : undefined}
                                    spanRows={props.spanRows ? props.spanRows : undefined}
                                    backgroundColorChild={props.backgroundColorChild}
                                    OnheaderChange={(e, colarr) => {
                                      setvisibleheadCells(e);
                                      if (props.colfilterOption) {
                                        props.colfilterOption(colarr)
                                      }
                                      reArrangeCol(colarr, e)
                                    }}
                                    // filterPopOpen={(e) => filterPopOpen(e, visibleheadCells)}
                                    rowSelect={props.rowSelect}
                                    setvisibledata={setvisibledata}
                                    // handlefinalrows={handlefinalrows}
                                    rawData={props.rawdata ? props.rawdata : []}
                                    setDownloadabledata={setDownloadabledata}
                                    ColAllOption={ColAllOption}
                                    setColAllOption={setColAllOption}
                                    processData={processData}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    groupBy={groupBy}
                                    checked={rowCheckedId.length === 0 ? false : true}
                                    selectAll={selectAll}
                                  />
                                  <tbody>
                
                                    {accordians.map((acc, index) => (
                                      <Accordion key={index} title={acc} length={handlefinalrows().filter((z) => z[groupBy] === acc).length}>
                                        {
                                          handlefinalrows().filter((z) => z[groupBy] === acc).map((row, index) =>

                                            // {
                                            //   props.isSpanRows ? 

                                            //   <React.Fra></>
                                            //   :
                                              <tr className={` hover:bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ${index === handlefinalrows().length - 1 && props.hidePagination ? '' : ' border-b border-Border-border-50 border-r dark:border-Border-border-dark-50'}`}
                                              // style={{ backgroundColor: curTheme === 'dark' ? '#000000' : props.backgroundColorChild ? props.backgroundColorChild : props.selectedTableCol === index ? "#E0E0E0" : row.color || '#ffff', color: curTheme === 'dark' ? 'dark gray' : undefined }}
                                              style={{ backgroundColor: rowCheckedId.map(x => x[props.checkBoxId]).includes(row[props.checkBoxId]) ? (curTheme === "dark" ? '#313131' : "#E0E0E0"):props.isCustomWidget ? row.color : "" }} key={row.id}>
                
                                              {props.rowSelect && (
                                                <td>
                                                  <div className="flex items-center pl-2">
                                                    <DragHandle />
                                                    <div className="ml-3">
                                                      <Checkboxs checked={rowCheckedId.map(x => x[props.checkBoxId]).includes(row[props.checkBoxId])} onChange={(e) => handleCheckChange(e, row)} />
                                                    </div>
                
                                                  </div>
                                                </td>
                                              )}
                
                                              {
                                                tableColumns.map((zz) => (

                                                  <td
                                                    className={`${props.isSpanRows && Array.isArray(row[zz]) ? ""  :"Table-td-LR Table-td-Top"} text-[14px]  border-Border-border-50 border-r dark:border-Border-border-dark-50  text-Text-text-secondary dark:text-Text-text-secondary-dark leading-[16px] font-normal font-geist-sans ${props.breakAll ? 'break-all' : ''}`}
                                                    align={'left'}
                                                  >
                                                      {props.isSpanRows ?
                        Array.isArray(row[zz]) ? 
                        row[zz][0].map((item, idx) => (
                          <React.Fragment>
                    <tr className="Table-td-LR Table-td-Top" key={idx}>
                          <td className="pl-4">
                            {item === '0' ? "-" : item}
                          </td>
                        </tr>
                        {
                          row[zz][0].length -1 !== idx  &&
                        <hr className="text-Border-border-50 dark:text-Border-border-dark-50" />
                        }
                        </React.Fragment>
                        ))
                        :
                    <tr  >
                        <td rowSpan={row[props.arrayKey][0].length || 1} >
                            {row[zz]}
                        </td>
                    </tr> : <td>{row[zz]}</td>  }

                                                   
                                                  </td>
                                                ))
                                              }
                                            </tr>
                                            // }
                
                                           
                                          )
                                        }
                                      </Accordion>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                
                              </>)
          }
        </div>



      </div>

    </React.Fragment>

  );
}
export default Table;

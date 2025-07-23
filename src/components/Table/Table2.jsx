import React, { useEffect, useMemo, useState } from "react";
import useGetTheme from 'TailwindTheme';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Edit from 'assets/neo_icons/Menu/ActionEdit.svg?react';
import TableSearch from "./TableSearch";
import TableDownload from "./TableDownload";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import EnhancedTableHeader from "./TableHeader";
import EnhancedTablePagination from "./TablePagination";
import PlusIcon from 'assets/neo_icons/Menu/plus_icon.svg?react';
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
import Downloads from 'assets/neo_icons/Menu/newTableIcons/download_table.svg?react';

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
  const [completeTableData, setCompleteTableData] = useState([]);
  const [visibleheadCells, setvisibleheadCells] = useState([]);
  const [visibledata, setvisibledata] = useState([]);
  const [openaccordion, setOpenAccordion] = useState([]);
  const [openIndex, setOpenIndex] = useState([])
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
    setPage(props.page ? props.page : 0)
    setRowsPerPage(props.rowsPerPage ? props.rowsPerPage : 10)
  }, [props.rowsPerPage, props.page])

  useEffect(() => {
    setOrder(props.order ? props.order : "asc")
    setOrderBy(props.orderBy ? props.orderBy : "")

  }, [props.order, props.orderBy])

  useEffect(() => {
    setOpenAccordion([])
  }, [props.closeAccordian])


  useEffect(() => {
    setPage(0)
    setSearch('');
  }, [])
  useEffect(() => { setPage(props.page ? props.page : 0) }, [props.page, props.data])
  useEffect(() => {
    setSearch('')
  }, [props.name])
  useEffect(() => {
    var tempheadCells = [...props.headCells];
    if (props.actionenabled) {
      tempheadCells.push({
        id: "actions",
        numeric: false,
        disablePadding: false,
        label: props.statusUpdate ? t("Status") : t("Actions"),
      });

    }
    if (props.collapsibleTable) {
      tempheadCells.unshift({
        id: 'ExpandOrCollapse',
        numeric: false,
        disablePadding: true,
        label: '',
        display: 'block'
      },)
    }

    setvisibleheadCells(tempheadCells);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.headCells, props.actionenabled])

  const rowsFormat = (arr, key) => {
    return arr.map((val) => {
      var obj = {};
      key.forEach((k, i) => (obj[k] = val[i]));
      return obj;
    })
  }

  const createrows = () => {
    const keys = props.colSpan ? props.spanRows.map((key) => key.key) : props.headCells.map((key) => key.id);
    var rows = [];
    if (props.data.length > 0) {
      rows = [].concat(rowsFormat(props.data, keys));
    }


    return rows;
  };

  const createdownloadablerows = () => {
    var keys = []
    // eslint-disable-next-line array-callback-return
    let finalHeadCell = props.downloadHeadCells ? props.downloadHeadCells : props.headCells
    finalHeadCell.forEach((key) => {
      if (key.display !== "none") keys.push(key.id)
    })
    var rows = [];
    if (props.downloadabledata.length > 0) {
      rows = [].concat(rowsFormat(props.downloadabledata, keys));
    }
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



  useEffect(() => {
    var rows = createrows();
    var tempvisibledata = [...rows]
    props.downloadabledata ?
      setDownloadabledata(createdownloadablerows()) :
      setDownloadabledata(rows);
    if (props.actionenabled) {
      tempvisibledata = tempvisibledata.map((row, index) => {
        return Object.assign({}, row, {
          action: !row.isActionEnable ? <RenderActionButton value={props.rawdata[index]} id={index} /> : '',
        });
      });

    }


    setCompleteTableData(tempvisibledata);
    setvisibledata(tempvisibledata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, openIndex.length]);


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
  const calculateData = (data, searchval) => {
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


  const RenderActionButton = (restaction) => {
    const { value, id } = restaction
    const [increment, setincrement] = useState(value && value.increment ? value.increment : 0);
    const [customval, setcustomval] = useState(false);
    let calcBtn = (value && value.calculations && value.calculations.length > 0) ? t("View Calculations") : t("Add Calculations")

    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>

        {props.statusUpdate &&
          <React.Fragment>

            {(value.status === 3) &&
              <span style={{ background: '#42af4252', fontSize: '13px', padding: '2px 5px', borderRadius: '4px' }}>{t("Completed")}</span>
            }
            {
              (value.status === 2) &&
              <span style={{ background: '#da1e2866', fontSize: '13px', padding: '2px 5px', borderRadius: '4px' }}>{t("Declined")}</span>
            }

            {((value.status !== 2) && (value.status !== 3)) &&
              <div style={{ width: '150px' }}>
                <SelectBox
                  labelId="Status-update"
                  label=""
                  defaultDisableName={""}
                  id="Status-update"
                  auto={false}
                  multiple={false}
                  options={props.StatusOption}
                  isMArray={true}
                  value={value.status ? value.status : 1}
                  onChange={(e) => handlestatus(e, value, id)}
                  keyValue={"name"}
                  keyId={"id"}
                />
              </div>
            }
          </React.Fragment>
        }
        {
          props.actionButton &&
          <Button
            type='ghost'
            value={props.actionButton}
            onClick={(e) => { props.ActionButtonClick(id, value, e) }}
          />
        }

        {props.enableIncrement &&
          <div style={{ display: "flex", alignItems: 'center' }}>
            <Left style={{ cursor: 'pointer' }} id={'moveleft-' + value.Partnum} onClick={() => {
              if (customval) {
                props.clickLeft(value, customval)
              } else {
                props.clickLeft(value, 1)
              }
              setcustomval(false)
            }} />
            <CustomTextField
              placeholder={t("Enter Value")}
              id={"inptut" + value.Partnum}
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
            <Right style={{ cursor: 'pointer' }} id={'moveright-' + value.Partnum} onClick={() => {
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

        {props.enableEdit && (
          <Edit

            stroke={(props.disablededit && props.disablededit.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#007BFF"}
            id={"edit-instrument-" + value}
            cursor={"pointer"}
            onClick={(e) => {
              if (!(props.disablededit && props.disablededit.findIndex(i => i === id) >= 0))
                props.handleEdit(id, value, e);

            }}
          />
        )}
        {props.enableView && (
          <Eye
            id={"view-instrument-" + value}
            stroke={curTheme === 'dark' ? '#ffff' : '#000000'}
            cursor={"pointer"}
            onClick={() => {
              props.handleView(id, value);

            }}
          />
        )}
        {props.enableDelete && (
          <Delete
            style={classes.actionIcon}
            stroke={(props.disableddelete && props.disableddelete.findIndex(i => i === id) >= 0) ? "#c4c4c4" : "#FF0D00"}
            id={"delete-instrument-" + value}
            cursor={"pointer"}
            onClick={(e) => {
              if (!(props.disableddelete && props.disableddelete.findIndex(i => i === id) >= 0))
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
  const handlefinalrows = () => {

    if (page > 0 && !props.serverside) {
      return stableSort(visibledata, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return stableSort(visibledata, getComparator(order, orderBy)).slice(
        0 * rowsPerPage,
        0 * rowsPerPage + rowsPerPage
      );
    }

  };

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
    setPage(newPage);
    // setOpenAccordion([])
    if (props.rejected || props.rowsPerPage) {
      props.onPageChange(newPage, rowsPerPage, props.rowPerPageSustain && !props.serverside ? { ...props.TableSustainValue, page: newPage, rowperpage: props.TableSustainValue.rowperpage } : {})

    }

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // setOpenAccordion([])
    if (props.rejected || props.rowsPerPage) {
      props.onPageChange(0, event.target.value, props.rowPerPageSustain ? { ...props.TableSustainValue, page: 0, rowperpage: parseInt(event.target.value, 10) } : {})
    }
  };
 



  // console.log(visibleheadCells,"visibleheadCells")
  return (
    <div width={props.width ? props.width : undefined} height={props.height ? props.height : undefined} className="border bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50 rounded-2xl border-solid">

      <div className="flex float-left items-center py-2 px-4 " >
        {props.heading && <TypographyNDL style={{ marginLeft: '15px' }} variant="heading-02-xs" color="secondary" model value={props.heading} />}
      </div>
      <div className="flex float-right items-center py-2 px-4 gap-2">
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
        {props.download && <TableDownload multitable={props.multitable} data={props.groupBy === 'sda_report' ? props.downloadFormatedData : downloadabledata} unFormatedData={props.unFormatedData}/>}

        {props.bulkEnable && <Button type='ghost' disabled={props.data.length > 0 ? false: true} icon={Downloads}   onClick={props.handleDownloadDialog}> </Button>}

        {props.buttonpresent && (
          <div >
            <Button
              type={"tertiary"}
              value={props.buttonpresent}
              icon={props.Buttonicon}
              Righticon={props.isButtomRight}
              onClick={props.onClickbutton}></Button>
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
      </div>
      <div className="w-full overflow-x-auto" >
        <table className="w-full text-sm text-left">
          <EnhancedTableHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={visibledata.length}
            headCells={visibleheadCells}
            colSpan={props.colSpan ? props.colSpan : undefined}
            spanRows={props.spanRows ? props.spanRows : undefined}
            backgroundColorChild={props.backgroundColorChild}
            groupBy={''}

          />

          <tbody>
            {handlefinalrows().map((row, index) => {
                const globalIndex = (page * rowsPerPage) + index;
              return (
                <React.Fragment>
                  <tr className={`bg-Background-bg-primary dark:bg-Background-bg-primary hover:bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ${index === handlefinalrows().length - 1 && props.hidePagination ? '' : ' border-b border-Border-border-50  dark:border-Border-border-dark-50'} `}
                    style={{ backgroundColor: curTheme === 'dark' ? '#000000' : props.backgroundColorChild ? props.backgroundColorChild : props.selectedTableCol === index ? "#E0E0E0" : (row.color ? row.color : '#ffff'), color: curTheme === 'dark' ? 'dark gray' : undefined }}>
                    {props.collapsibleTable &&
                      <td>
                        <div
                          className="pl-2"
  onClick={() => props.handleChangeIsopen(globalIndex, row["S.No"])}
                        >
                        
{props.rawdata.length > 0 && (props.formatJson[row["S.No"]]  ?? false) ?
  (props.expandIcon ? <props.collapsibleIcon /> : <KeyboardArrowUpIcon />)
  :
  (props.collapsibleIcon ? <props.expandIcon /> : <KeyboardArrowDownIcon />)
}

                        </div>
                      </td>
                    }

                    {(props.colSpan ? props.spanRows : visibleheadCells).filter(f => f.id !== 'ExpandOrCollapse').map((val, i) => {
                      // console.log(val,"val")
                      return val.display !== "none" &&
                        <td
                          className={`Table-td-LR Table-td-Top text-[14px] text-Text-text-secondary dark:text-Text-text-secondary-dark leading-[16px] font-normal font-geist-sans ${props.breakAll && val.id === props.breakid ? 'break-all' : ''}`}
                          align={val.align ? val.align : 'left'} style={{ color: row.textcolor, }}
                        >
                          {Object.values(row)[i] && props.rejected && (Object.values(row)[i].toString().includes("Rejected")) ?
                            <span ><span style={{ color: 'red' }}>{Object.values(row)[i].split(',')[0]} ,</span>{Object.values(row)[i].split(',')[1]}</span>
                            :
                            <span >{Object.values(row)[i]}</span>

                          }

                        </td>
                    })}

                  </tr>
                  {props.collapsibleTable &&
                    <tr>
                      <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
 {(props.formatJson[row["S.No"]] ?? false) && (
  <div style={{ marginBottom: 10 }}>
    {props.GetCollapsibleRow(row, index)}
  </div>
)}
                      </td>
                    </tr>
                  }
                </React.Fragment>
              )
            })}


          </tbody>

        </table>
      </div>
      {!props.hidePagination &&
        <EnhancedTablePagination
          onPageChange={handleChangePage}
          hidePageSelection={props.hidePageSelection}
          onRowsPerPageChange={handleChangeRowsPerPage}
          visibledata={visibledata}
          count={props.count}
          rowsPerPage={rowsPerPage}
          page={page}
          PerPageOption={props.PerPageOption}
          order={order}
        />
      }

    </div>
  );
}
export default Table;

/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView"; 
import Typography from "components/Core/Typography/TypographyNDL";
import TreeItem from "@material-ui/lab/TreeItem";
import { useRecoilState } from "recoil";
import {
  defaultHierarchyData,
  selectedmeterExplore,
  themeMode
} from "recoilStore/atoms"; 
import IcondataLight from 'assets/neo_icons/Equipments/light'
import IcondataDark from 'assets/neo_icons/Equipments/dark'

const useTreeItemStyles = makeStyles((theme) => ({
  content: {
    flexDirection: "row-reverse",
    width: "max-content"
  },
  labelRoot: {
    display: "flex",
    justifyContent: "space-between",
    padding: 1
  },
  labelIcon: {
    marginRight: 1
  },
  labelText: {
    fontWeight: "600",
    flexGrow: 1,
    marginRight: "25px",

    fontStyle: "normal",
    lineHeight: "16px",
    fontSize: "13px",
    paddingTop: "inherit"
  },
  meterValue: {
    color: "#0f62fe",
    flexGrow: 1,
    marginRight: "25px",

    fontStyle: "normal",
    lineHeight: "16px",
    fontSize: "13px",
    paddingTop: "inherit"
  },
  meterValue1: {
    color: "#1ED045",
    flexGrow: 1,
    marginRight: 1,

    fontStyle: "normal",
    lineHeight: "16px",
    fontSize: "13px",
    paddingTop: "inherit",
    position: "absolute",
    left: "31px"
  },

  root: {
    position: "relative",
    "&:before": {
      pointerEvents: "none",
      content: '""',
      position: "absolute",
      width: 14,
      left: -1,
      top: 14,
      maxWidth: 400,
      borderBottom: (props) =>
        props.test === 1
          ? `1px dashed ${fade(theme.colorPalette.primary, 0.4)}`
          : "none"
    },
    ".MuiTreeItem-root > .MuiTreeItem-content > .MuiTypography-root .MuiTreeItem-label .MuiTypography-body1": {
      backgroundColor: "red"
    }
  },
  iconContainer: {
    "& .close": {
      opacity: 0.3
    }
  },
  group: {
    borderLeft: `1px dashed ${fade(theme.colorPalette.primary, 0.4)}`
  },
  treeItemStyle: {
    marginLeft: "7px"
  },

}));


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 364,
    border: "1px solid rgba(224, 224, 224, 1)",
    borderRadius: 4,
    padding: 6
  }
}));

export default function HierarchyReport() {
  const classes = useStyles();
  const [curTheme] = useRecoilState(themeMode);
  const [hierarchyData] = useRecoilState(defaultHierarchyData);
  const [treeData, setTreeData] = useState([]);
  const [, setSelectedMeter] = useRecoilState(selectedmeterExplore);
  let reportingMetricArr = [];
  
  function StyledTreeItem(props) {
    const classes1 = useTreeItemStyles(props);
    const {
      labelText,
      labelIcon,
      meterValue,
      meterValue1,
      reportMeterValue,
      ...other
    } = props;
  
  return (
    <TreeItem
    id={'report-hierarchy-' + meterValue}
    onClick={(e)=>meterSelected(e,meterValue)}
      label={
        <div className={classes1.labelRoot}>
         
            {curTheme === 'dark' ?
              IcondataDark.filter((x, y) => y === labelIcon).map((Component, key) => (
                <Component />//NOSONAR
              ))
              :
              IcondataLight.filter((x, y) => y === labelIcon).map((Component, key) => (
                <Component />//NOSONAR
              ))
            }
            <Typography id={'report-hierarchy-' + labelText} variant="label-02-s" value={labelText} className={classes1.labelText} onClick={(e) => test(e, meterValue)}/>
            <Typography variant="label-02-s" value={reportMeterValue} className={classes1.meterValue} aligh="right"/>
            <Typography variant="label-02-s" value={meterValue1} className={classes1.meterValue1} aligh="right"/>
          </div>
        }
        classes1={{
          root: classes1.root,
          content: classes1.content,
          group: classes1.group,
          iconContainer: classes1.iconContainer
        }}
        {...other}
      />
    );
  }

  const test = (e, data) => {
    console.log(" reportingMetricArr ------------", reportingMetricArr);
  }
  const meterSelected = (e, data) => {
    console.log("hi");
    let hierarchyDataArr = hierarchyData[0].hierarchy.hierarchy[0];
    if (hierarchyDataArr.type === "instrument") {
      reportingMetricArr.push(hierarchyDataArr.actualname)
      setSelectedMeter(reportingMetricArr)
    } else {
      let selectedEntityArr = getMeterList(hierarchyDataArr, data);
      if (selectedEntityArr.children !== undefined) {
        selectedEntityArr.children.forEach(function (a) {
          if (a.type === "instrument") {
            reportingMetricArr.push(a.actualname)
          }
        })
        setSelectedMeter(reportingMetricArr)
      } else if (selectedEntityArr.type === "instrument") {
        reportingMetricArr = []
        reportingMetricArr.push(selectedEntityArr.actualname)
        setSelectedMeter(reportingMetricArr)
      }
    }

    localStorage.setItem('selectedMeterExplore', reportingMetricArr);
  }
 
  function getMeterList(object, string) {
    if (!object || typeof object !== 'object') return;

    let result;

    function searchForObject(obj) {
        Object.values(obj).some(v => {
            if (v === string) {
                result = obj;
                return true; // exit the loop early if a match is found
            } else {
                searchForObject(v);
                return false;
            }
        });
    }

    searchForObject(object);

    return result;
}

  let i = 2;

  useEffect(() => {
    if (hierarchyData !== "" && hierarchyData.length > 0) {
      let hierarchyDataArr = hierarchyData[0].hierarchy.hierarchy[0]
      let tempProps = JSON.parse(JSON.stringify(hierarchyDataArr));
      tempProps.nodeId = 1;
     
      tempProps.children.forEach(function (item) {
        item.nodeId = i;
        item.test = 1;
    
        i++
      })
      const indfinder = (a) => {
        a.forEach(function (b) {
          b.test = 1;
          b.nodeId = i;
      
          i++
        })

        a.forEach(function (b) {
          if (b.hasOwnProperty("children") && b.children.length > 0) {
            indfinder(b.children)
          }
        })
      }
      tempProps.children.forEach(function (a) {
        if (a.hasOwnProperty("children")) {
          indfinder(a.children)
        }
      })
      setTreeData(tempProps)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchyData])

  const TreeDet = ({ data }) => (
    <StyledTreeItem className={classes.treeItemStyle} nodeId={data.nodeId} key={data.nodeId} test={data.test} labelText={data.name} labelIcon={data.icon} meterValue={data.id} reportMeterValue={data.Month1}>
      {data.children && data.children.length > 0 && data.children.map(item => (
        <TreeDet data={item} />
      ))}
    </StyledTreeItem>
  );

  return (
    <>
      {hierarchyData !== "" ?

        <TreeView
          className={classes.root}
        >
          <TreeDet data={treeData} />
        </TreeView>
        :
        null}
    </>
  );
}

import React, { useEffect, useState } from "react"; 
import 'antd/dist/antd.min.css'; 
import { Table } from 'antd'; 
import TypographyNDL from 'components/Core/Typography/TypographyNDL';

export default function TableReports(props) {
  const [columnArr, setColumnArr] = useState(props.columnArr); 
  const { Column, ColumnGroup, } = Table;
  const [tableHeight, setTableHeight] = useState('auto');
  useEffect(()=>{
    handleResize()
  },[])
  
  useEffect(() => {
    setColumnArr(props.columnArr)  
  }, [props]);

  const handleResize = () => {
    const windowHeight = window.innerHeight;
    if (windowHeight < 600) {
      setTableHeight(300);
    } else if (windowHeight < 800) {
      setTableHeight(380);
    } else {
      setTableHeight(580);
    }
  }  

  const FormatedReported = props.reportData.map(item => {
    for (let key in item) {
        if (item[key] === "") {
            item[key] = "-";
        }
    }
    return item;
});

  return ( 
      <React.Fragment > 
        
        {
          FormatedReported && FormatedReported.length > 0 ? (
            <Table dataSource={FormatedReported && Array.isArray(FormatedReported)?FormatedReported:[]} expandable={{defaultExpandAllRows: true}} className={"bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 "}  scroll={{x: true,y: tableHeight }} pagination={{ showSizeChanger: true}} >
              {
                (props.reportColumn && Array.isArray(props.reportColumn)) && props.reportColumn.map(x=>{
                  return (
                    <>
                      {
                        x.isGroup && x.subHeader && (
                          <ColumnGroup title={x.title}>
                            {
                              x.subHeader.map(y=>{
                                return (
                                  <Column width={100} fixed={x.fixed?x.fixed:false} title={y.title} dataIndex={y.key} key={y.key} render={(text) => (text === undefined || text === null || text === "" ? "-" : text)} /> 
                                )
                              })
                            }                          
                          </ColumnGroup> 
                        )}
                        {
                         !x.isGroup && !x.subHeader &&
                        (
                          <Column width={100} fixed={x.fixed?x.fixed:false} title={x.title} dataIndex={x.key} key={x.key}  render={(text) => (text === undefined || text === null || text === "" ? "-" : text)}/>
                        )
                      }
                    </>                        
                  )
                })
              }             
            </Table> 
          )
        :
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col gap-0.5 items-center justify-center">
          <TypographyNDL value="No Data Available for the selected range." variant="paragraph-s" color='secondary'/>
          <TypographyNDL value="Please try a different time range to view the report" variant="paragraph-s" color='secondary' />
          </div>
      
        </div>
       }
          {
            !FormatedReported && FormatedReported.length <= 0 &&
          (
            <Table key="not-loading-done" className={"antTable"} columns={columnArr} dataSource={[]} />
          )
        }

      </React.Fragment> 
  );
}

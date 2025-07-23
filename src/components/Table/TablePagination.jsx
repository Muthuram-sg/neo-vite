
import React from "react";
import CaretLeft from 'assets/neo_icons/Arrows/CaretLeft.svg?react';
import CaretRight from 'assets/neo_icons/Arrows/CaretRight.svg?react';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';

function Tablepagination(props) {
    const pageSet = Math.ceil(parseFloat(props.count ? props.count :props.visibledata.length,props.rowsPerPage)/props.rowsPerPage)
    const TotalPage = props.count ? props.count :props.visibledata.length
    const PageRange = (props.page+1) !== pageSet ? (props.rowsPerPage * (props.page+1)) : TotalPage
    const PageOption=props.PerPageOption ? props.PerPageOption.map(x=>{
        return {id:x,value:x}
    }) :[{id : 5,value: 5},{id : 10,value: 10},{id : 25,value: 25},{id : 50,value: 50},{id : 100,value: 100}]
    let Pages=[]
    for (let i = 0; i <  pageSet ; i++) {
        Pages.push({id: i,value: i+1})
    }
    
    function onRowsPerPageChange(e,data){
        // console.log(e,data,"onRowsPerPageChange") 
        props.onRowsPerPageChange(e,data)
    }

    
    return ( 
       
       
      
            <div className={`flex justify-between h-12  bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50 ${ props.noBorderRadius ? "" : "rounded-2xl"}`}>
                    <div className="flex items-center gap-2" >
                        <div className="flex p-4 items-center gap-1">
                        <span className="text-[14px] whitespace-nowrap  font-medium text-Text-text-secondary dark:text-Text-text-secondary-dark  leading-[16px] font-geist-sans my-0 ">Items per page: </span>
                        
                        {
                            (props.isNooption || props.hidePageSelection) ? 
                        <span className="text-[14px] leading-[14px] font-geist-sans font-medium text-Text-text-secondary dark:text-Text-text-secondary" >{props.rowsPerPage}</span>
                            :
                            <div  style={{ width: "60px" }}>
                            <SelectBox
                           
                            labelId="user-role"
                            id={"Table-PageLength"+Math.random()*10}
                            auto={false}
                            multiple={false}
                            options={PageOption} 
                            checkbox={false}
                            value={props.rowsPerPage}
                            onChange={onRowsPerPageChange}
                            keyValue="value"
                            keyId="id" 
                           
                        />
                        </div>
                       

                        }
                      
                        </div>
                        <div className="border-l flex items-center grow shrink basis-0 self-stretch border-Border-border-50  dark:border-Border-border-dark-50 ">
                        <span className="p-4   text-[14px] leading-[16px] font-geist-sans font-medium text-Text-text-secondary dark:text-Text-text-secondary" >{((props.rowsPerPage * props.page)+1) +'-'+ PageRange +' of '+TotalPage +' items' } </span>
                        </div>
                    </div>
                   
                
                <div className="self-stretch p-4 border-l  justify-start items-center gap-1 flex border-Border-border-50  dark:border-Border-border-dark-50 " >
                    {
                        pageSet ?
                       <React.Fragment>
                                 {
                                    props.hidePageSelection ? 
                        <span className=" text-[14px]  font-geist-sans leading-[16px] font-medium text-Text-text-secondary dark:text-Text-text-secondary whitespace-nowrap">{Number(props.page) + 1}</span>
                                    :
                                    <div style={{ width: "60px" }}>

                                    <SelectBox
                                    labelId="user-role"
                                    id={"Table-Pages"+Math.random()*10}
                                    auto={false}
                                    placeholder={'1'}
                                    multiple={false}
                                    options={Pages} 
                                    checkbox={false}
                                    value={props.page}
                                    onChange={(e,data)=>props.onPageChange(e,(e.target.value))}
                                    keyValue="value"
                                    keyId="id" 
                                />
                        </div>

                                }
                       </React.Fragment>
                         
                    :
                    <span className="whitespace-nowrap text-[14px] leading-[16px] font-geist-sans font-medium text-Text-text-secondary dark:text-Text-text-secondary">0 </span>
                    }
                    
                    <div className="flex items-center " >
                        <span className=" text-[14px]  font-geist-sans leading-[16px] font-medium text-Text-text-secondary dark:text-Text-text-secondary whitespace-nowrap">{'of '+ pageSet+' pages' }</span>
                <div className="ml-4 p-4 self-stretch border-l  justify-start items-center flex border-Border-border-50  dark:border-Border-border-dark-50 " >
                        <CaretLeft className="TableNext" stroke={props.page > 0 ? "#161616" : "#C6C6C6"} fill={props.page > 0 ? "#161616" : "#C6C6C6"} 
                            onClick={(e)=>{if(props.page > 0) props.onPageChange(e,(props.page-1))}}
                        />
                        </div>
                <div className="self-stretch p-4 border-l  justify-start items-center flex border-Border-border-50  dark:border-Border-border-dark-50 " >

                        {/* <span className="TableVR"></span> */}
                        <CaretRight className="TableNext" stroke={(props.page+1) !== pageSet ? "#161616" : "#C6C6C6"} fill={(props.page+1) !== pageSet ? "#161616" : "#C6C6C6"}
                            onClick={(e)=>{if((props.page+1) !== pageSet) props.onPageChange(e,(props.page+1))}}
                        />
                        </div>
                    </div>
                </div>
            </div>
     
    )
}
const isRender = (prev, next) => {
    return prev.order !== next.order  || prev.page !== next.page  || prev.rowsPerPage !== next.rowsPerPage || prev.visibledata.length !== next.visibledata.length || prev.count !== next.count ? false : true
}
const TablePagination = React.memo(Tablepagination, isRender)
export default TablePagination

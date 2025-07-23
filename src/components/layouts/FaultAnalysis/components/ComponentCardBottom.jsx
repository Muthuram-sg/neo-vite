import React from 'react';
import Asset from 'assets/neo_icons/FaultAnalysis/AssetNew.svg?react';
import Instrument from 'assets/neo_icons/FaultAnalysis/MeterNew.svg?react';
import Axis from 'assets/neo_icons/FaultAnalysis/Axis.svg?react';
import History from 'assets/neo_icons/FaultAnalysis/History.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import TagIcon from 'assets/neo_icons/Menu/newMenuIcon/tag.svg?react';
import { useRecoilState } from "recoil";
import {  themeMode } from "recoilStore/atoms";


function ComponentCardBottom(props) {
    const [CurTheme] = useRecoilState(themeMode);
    // let analystName = "";

    // if (props.type === 1) {
    //     analystName = props.instrument.latest_fault_data.updated_by ? props.instrument.latest_fault_data.analyst : "";
    // } else {
    //     analystName = props.fault.updated_by ? props.fault.analyst : "";
    // }

    const getValue = (data) => {
        if (data.length === 1) {
            return data[0].value;
        } else if (data.length > 1) {
            const velItem = data.find(item => item.key.toLowerCase().includes("vel"));
            return velItem ? velItem.value : data[0].value;
        }
        return "-";
    };

    return (
        <div className='px-2 rounded-md bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark' style={{ display: "flex", justifyContent: "space-between",
         }}>
            <div style={{ display: "flex", alignItems: "center"}}>
                <Asset stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={16} height={16}/>
                {/* <Typography variant="paragraph-xs"  value={props.asset + " | "} ></Typography> */}
                <Typography variant="paragraph-xs"   style={{marginLeft:"4px"}}>{props.asset}</Typography>
                <div className='text-Text-text-secondary dark:text-Text-text-secondary-dark ml-2' >|</div>
                <Instrument stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'}  width={16} height={16} style={{marginLeft:"8px"}}/>
                <Typography variant="paragraph-xs"   value={props.instrument && props.instrument.instrument_name} style={{marginLeft:"4px"}}></Typography>
                {((props.type === 1 && props.instrument.faults.length > 0) || props.type !== 1) && (
                    <React.Fragment>
                            <div className='text-Text-text-secondary dark:text-Text-text-secondary-dark ml-2'>|</div>
                        <Axis stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={16} height={16} style={{marginLeft:"8px"}}/>
                        <Typography variant="paragraph-xs"   style={{marginLeft:"4px"}} value={props.type === 1 ? props.instrument.latest_fault_data.key : props.fault.key}></Typography>
                    </React.Fragment>
                )}
                {
                    props.loading ? (
                    <div ><CircularProgress  style={{marginLeft:"8px"}}/>
                    </div>
                    ) :
                        (
                            <React.Fragment>
                                {((props.type === 1 && props.instrument.faults.length > 0 && props.filtereddata.length > 0)) && (
                                    <React.Fragment>
                                            <div className='text-Text-text-secondary dark:text-Text-text-secondary-dark ml-2'>|</div>
                                            <div className='ml-2'>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.66666 6.33332C6.03485 6.33332 6.33332 6.03485 6.33332 5.66666C6.33332 5.29847 6.03485 4.99999 5.66666 4.99999C5.29847 4.99999 4.99999 5.29847 4.99999 5.66666C4.99999 6.03485 5.29847 6.33332 5.66666 6.33332Z" stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.66666 4.66666V7.23932C2.66666 7.59732 2.80866 7.94066 3.06199 8.19399L8.47266 13.6047C8.59802 13.73 8.74685 13.8295 8.91065 13.8974C9.07446 13.9652 9.25002 14.0001 9.42732 14.0001C9.60462 14.0001 9.78019 13.9652 9.94399 13.8974C10.1078 13.8295 10.2566 13.73 10.382 13.6047L13.6047 10.382C13.73 10.2566 13.8295 10.1078 13.8974 9.94399C13.9652 9.78019 14.0001 9.60462 14.0001 9.42732C14.0001 9.25002 13.9652 9.07446 13.8974 8.91065C13.8295 8.74685 13.73 8.59802 13.6047 8.47266L8.19332 3.06199C7.94028 2.80899 7.59715 2.66679 7.23932 2.66666H4.66666C4.13622 2.66666 3.62752 2.87737 3.25244 3.25244C2.87737 3.62752 2.66666 4.13622 2.66666 4.66666Z" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                                            </div>
                                            

                                        <Typography variant="paragraph-xs" style={{marginLeft:"8px"}} color={"secondary"} value={props.filtereddata && props.filtereddata[0].title}  />
                                        <Typography variant="paragraph-xs" color={"secondary"} value={":"}  />
                                        <Typography variant="paragraph-xs" color={"secondary"} value={getValue(props.filtereddata[0].data)}  />
                                    </React.Fragment>
                                )}
                               {(props.type === 2 && props.filtereddata.length > 0 && props.fault && props.fault.time) && (
                                <React.Fragment>
                                     <div className='text-Text-text-secondary dark:text-Text-text-secondary-dark ml-2'>|</div>
                                    {props.filtereddata.some(x => x.data && x.data.length > 0 && x.data.some(item => new Date(new Date(item.time).getTime()+30000) >= new Date(props.fault.time) && new Date(new Date(item.time).getTime()-30000) <= new Date(props.fault.time))) ? (
                                        props.filtereddata
                                            .filter(x => x.data && x.data.length > 0 && x.data.find(item => (item.key.toLowerCase().includes(`_${props.fault.key.toLowerCase()}_`) || (props.fault.key.toLowerCase().includes("e") && item.key.toLowerCase().includes("env"))) && new Date(new Date(item.time).getTime()+30000) >= new Date(props.fault.time) && new Date(new Date(item.time).getTime()-30000) <= new Date(props.fault.time)))
                                            .slice(0, 1)
                                            .map(filteredItem => {
                                                const items = filteredItem.data.filter(item => new Date(new Date(item.time).getTime()+30000) >= new Date(props.fault.time) && new Date(new Date(item.time).getTime()-30000) <= new Date(props.fault.time) && (item.key.toLowerCase().includes(`_${props.fault.key.toLowerCase()}_`) || (props.fault.key.toLowerCase().includes("e") && item.key.toLowerCase().includes("env"))));
                                                if (!items || items.length === 0) return null;

                                                let shouldDisplay = false;
                                                let displayItems = [];
                                                let displayedTitles = new Set();
                                                let displayedValues = new Set();

                                                items.forEach(item => {
                                                    if ((item.key.toLowerCase().includes("acc") && filteredItem.title.toLowerCase().includes("acc")) ||
                                                        (item.key.toLowerCase().includes("vel") && filteredItem.title.toLowerCase().includes("vel"))) {
                                                        if (!displayedTitles.has(filteredItem.title) || !displayedValues.has(item.value)) {
                                                            shouldDisplay = true;
                                                            displayItems.push(item);
                                                            displayedTitles.add(filteredItem.title);
                                                            displayedValues.add(item.value);
                                                        }
                                                    }
                                                });

                                                return shouldDisplay ? (
                                                    <React.Fragment key={filteredItem.title}>
                                                        {displayItems.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                   <div className='ml-2'>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.66666 6.33332C6.03485 6.33332 6.33332 6.03485 6.33332 5.66666C6.33332 5.29847 6.03485 4.99999 5.66666 4.99999C5.29847 4.99999 4.99999 5.29847 4.99999 5.66666C4.99999 6.03485 5.29847 6.33332 5.66666 6.33332Z" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.66666 4.66666V7.23932C2.66666 7.59732 2.80866 7.94066 3.06199 8.19399L8.47266 13.6047C8.59802 13.73 8.74685 13.8295 8.91065 13.8974C9.07446 13.9652 9.25002 14.0001 9.42732 14.0001C9.60462 14.0001 9.78019 13.9652 9.94399 13.8974C10.1078 13.8295 10.2566 13.73 10.382 13.6047L13.6047 10.382C13.73 10.2566 13.8295 10.1078 13.8974 9.94399C13.9652 9.78019 14.0001 9.60462 14.0001 9.42732C14.0001 9.25002 13.9652 9.07446 13.8974 8.91065C13.8295 8.74685 13.73 8.59802 13.6047 8.47266L8.19332 3.06199C7.94028 2.80899 7.59715 2.66679 7.23932 2.66666H4.66666C4.13622 2.66666 3.62752 2.87737 3.25244 3.25244C2.87737 3.62752 2.66666 4.13622 2.66666 4.66666Z" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                                            </div>
                                                                <Typography variant="paragraph-xs" style={{marginLeft:"4px"}} color={"secondary"} value={filteredItem.title}  />
                                                                <Typography variant="paragraph-xs" color={"secondary"} value={":"}  />
                                                                <Typography variant="paragraph-xs" color={"secondary"} value={item.value ? item.value : "-"}  />
                                                            </React.Fragment>
                                                        ))}
                                                    </React.Fragment>
                                                ) : null;
                                            })
                                    ) : (
                                        Array.from(new Set(props.filtereddata.map(item => item.title)))
                                            .filter(title => title && title.length > 0)
                                            .map((title, index) => {
                                                const filteredItem = props.filtereddata.find(item => item.title === title);
                                                if (!filteredItem) return null;

                                                const titleParts = filteredItem.title.split(/\(([^)]+)\)/);
                                                const contentInsideParentheses = titleParts[1];

                                                return (
                                                    <React.Fragment key={title}>
                                                        {contentInsideParentheses.toUpperCase() === props.fault.key.toUpperCase() && (
                                                            <>
                                                            
                                                                <Typography variant="paragraph-xs"   value={filteredItem.title}  />
                                                                <Typography variant="paragraph-xs" color={"secondary"} value={":"}  />
                                                                <Typography variant="paragraph-xs" color={"secondary"} value={"-"}  />
                                                            </>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                    )}
                                </React.Fragment>
                            )}
                                {props.type === 3 && props.filtereddata && props.filtereddata.length > 0 && (
                                <React.Fragment>
                                      <div className='text-Text-text-secondary dark:text-Text-text-secondary-dark ml-2'>|</div>

                                    {props.filtereddata.filter(x => x.data && x.data.length > 0 && x.data.some(item => new Date(new Date(item.time).getTime()+30000) >= new Date(props.fault.time) && new Date(new Date(item.time).getTime()-30000) <= new Date(props.fault.time))).length > 0 ? (
                                        <React.Fragment>
                                              <div className='ml-2'>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.66666 6.33332C6.03485 6.33332 6.33332 6.03485 6.33332 5.66666C6.33332 5.29847 6.03485 4.99999 5.66666 4.99999C5.29847 4.99999 4.99999 5.29847 4.99999 5.66666C4.99999 6.03485 5.29847 6.33332 5.66666 6.33332Z" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.66666 4.66666V7.23932C2.66666 7.59732 2.80866 7.94066 3.06199 8.19399L8.47266 13.6047C8.59802 13.73 8.74685 13.8295 8.91065 13.8974C9.07446 13.9652 9.25002 14.0001 9.42732 14.0001C9.60462 14.0001 9.78019 13.9652 9.94399 13.8974C10.1078 13.8295 10.2566 13.73 10.382 13.6047L13.6047 10.382C13.73 10.2566 13.8295 10.1078 13.8974 9.94399C13.9652 9.78019 14.0001 9.60462 14.0001 9.42732C14.0001 9.25002 13.9652 9.07446 13.8974 8.91065C13.8295 8.74685 13.73 8.59802 13.6047 8.47266L8.19332 3.06199C7.94028 2.80899 7.59715 2.66679 7.23932 2.66666H4.66666C4.13622 2.66666 3.62752 2.87737 3.25244 3.25244C2.87737 3.62752 2.66666 4.13622 2.66666 4.66666Z" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                                            </div>

                                            <Typography variant="paragraph-xs" style={{marginLeft:"8px"}} value={props.filtereddata[0].title}  />
                                            <Typography variant="paragraph-xs"value={":"}  />
                                            {props.filtereddata.map((filteredItem, index) => {
                                                let itemAlreadyDisplayed = false; // Define itemAlreadyDisplayed here
                                                return (
                                                    <React.Fragment key={index}>
                                                        {filteredItem.data.map((item, subIndex) => (
                                                            <React.Fragment key={subIndex}>
                                                                {item.key.toLowerCase().includes("acc") && filteredItem.title.toLowerCase().includes("acc") && (
                                                                    <Typography variant="paragraph-xs" color={"secondary"} value={item.value ? item.value : "-"}  />
                                                                )}
                                                                {item.key.toLowerCase().includes("vel") && filteredItem.title.toLowerCase().includes("vel") && (
                                                                    <>
                                                                        {!itemAlreadyDisplayed && (
                                                                            <Typography variant="paragraph-xs"value={item.value ? item.value : "-"} />
                                                                        )}
                                                                        {itemAlreadyDisplayed = true}
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </React.Fragment>
                                    ) : (
                                        Array.from(new Set(props.filtereddata.map(item => item.title)))
                                            .filter(title => title && title.length > 0)
                                            .map((title, index) => {
                                                const filteredItem = props.filtereddata.find(item => item.title === title);
                                                if (!filteredItem) return null;

                                                const titleParts = filteredItem.title.split(/\(([^)]+)\)/);
                                                const contentInsideParentheses = titleParts[1];

                                                return (
                                                    <React.Fragment key={index}>
                                                        {contentInsideParentheses && contentInsideParentheses.toUpperCase() === props.fault.key.toUpperCase() && (
                                                            <>
                                                                <Typography variant="paragraph-xs" color={"secondary"} value={filteredItem.title}  />
                                                                <Typography variant="paragraph-xs" color={"secondary"}  value={":"}  />
                                                                <Typography variant="paragraph-xs" color={"secondary"}  value={"-"}  />
                                                            </>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                    )}
                                </React.Fragment>
                            )}
                            </React.Fragment>
                        )
                }
                {(props.type === 2 && props.fault.mergedHistory.length > 0) && (
                    <React.Fragment>
                        {/* <Typography variant="paragraph-xs" color={"secondary"} value={"|"} style={{ margin: 10 }}></Typography> */}
                        <div className='text-Text-text-secondary dark:text-Text-text-secondary-dark ml-2'>|</div>
                        <History stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={16} height={16}  />
                        <Typography variant="paragraph-xs"  style={{marginLeft:"8px"}}color={"secondary"} value={props.fault.mergedHistory.reduce((acc, curr) => acc + (curr.history?.length || 0), 0)}  ></Typography>
                    </React.Fragment>
                    )}
            </div>
          
        </div>
    );
}

export default ComponentCardBottom;

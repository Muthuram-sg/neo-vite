import React from "react";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"  
import { useRecoilState } from "recoil"; 
import { themeMode } from "recoilStore/atoms"; 
import Typography from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";

const ListCustom = (props) => {
  const { pendingReqList } = props;
  const [curTheme] = useRecoilState(themeMode);
  return (
    <KpiCards style={props.card}>
      <div style={{ padding: 0 }}>
        <React.Fragment> 
            <ul dense="true">
              {pendingReqList &&
                pendingReqList !== "" &&
                pendingReqList.map((val, ind) => {
                  return (
                    <React.Fragment>
                      <li key={val.id}> 
                            <Typography
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color:
                                  curTheme === "light" ? "#242424" : "#A6A6A6",
                              }} 
                              value={(val.line.name +" (" +val.user.name +" - " +
                                val.role.role.replace("_", " ") +
                                ")")}/>  
                            <Typography
                              style={{
                                fontSize: "12px",
                                color:
                                  curTheme === "light" ? "#242424" : "#808080",
                              }}
                              value={val.line.gaia_plants_detail.activity_name +
                                ", " +
                                val.line.gaia_plants_detail.business_name +
                                ", " +
                                val.line.gaia_plants_detail.country_name}
                            /> 
                        <div key={val.id}>
                          {props.constrol(val.id, val.isDelete, ind)}
                        </div>
                      </li>
                      <HorizontalLine
                        variant="divider1"
                        style={
                          curTheme === "light"
                            ? props.dividerStyleLight
                            : props.dividerStyleDark
                        }
                      />
                    </React.Fragment>
                  );
                })}
            </ul> 
        </React.Fragment>
      </div>
    </KpiCards>
  );
};

const isNotRender = (prev, next) => {
  return prev !== next ? false : true;
};
const List = React.memo(ListCustom, isNotRender);
export default List;

import React from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import CustomizedProgressBars from "components/Core/ProgressBar/Progress";

const FaultStatusOverview = (props) => {
    let result = props.chartData;

    return (
        <div className="py-2">
            <div className="p-2 pl-0 pt-0">
                <Typography variant='label-02-s' value={"Fault Breakdown"} />
            </div>
            {result && result.length > 0 ? (
                result.map((s, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col gap-1">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='paragraph-xs' value={s.name} />
                                <Typography variant='paragraph-xs' mono value={(s.data ? s.data : 0) + "%"} />
                            </div>
                            <CustomizedProgressBars 
                                value={s.data ? s.data : 0} 
                                color={"linear-gradient(270deg, #0090FF -0.43%, #74DAF8 99.57%)"} 
                            />
                        </div>
                        <div className="mb-3" />
                    </React.Fragment>
                ))
            ) : (
                <div className="p-2">
                    <Typography variant='label-02-s' value={"No Data"} />
                </div>
            )}
        </div>
    );
};

export default FaultStatusOverview;

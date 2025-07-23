import React from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import CustomizedProgressBars from "components/Core/ProgressBar/Progress";

const FaultStatusOverview = (props) => {
    const totalSum = props.data.reduce((sum, count) => sum + count, 0);

    const percentages = props.data.map(count => ((count / totalSum) * 100).toFixed(2));
    let dataval = percentages.map(str => parseFloat(str));
   
    let result = [];

    for (let i = 0; i < dataval.length; i++) {
        result.push({
            data: dataval[i],
            name: props.names[i],
        });
    }

    result.sort((a, b) => b.data - a.data);

    return (
        <div className="py-2">
 { result.map((s, index) => {
            return (
                <React.Fragment key={index+1}>
                <div className="flex flex-col gap-1 ">
                    <div  style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant='paragraph-xs' value={s.name} />
                        <Typography variant='paragraph-xs' mono value={(s.data ? s.data : 0) + "%"} />
                    </div>
                    <CustomizedProgressBars value={s.data ? s.data : 0} color={"linear-gradient(270deg, #0090FF -0.43%, #74DAF8 99.57%)"} />
                </div>
                <div className="mb-3" />
                </React.Fragment>
            );
        })
        }
        </div>
      
    );
};

export default FaultStatusOverview;

import React from "react";
import Grid from "components/Core/GridNDL";
import ButtonNDL from "components/Core/ButtonNDL";

const ApproveButton = (props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={2} sm={5}>
        <ButtonNDL
         type="primary"
          onClick={() => props.approveReq(props.id)}
          value={props.BtnValue1}
        />
      </Grid>
      <Grid item xs={2} sm={7}>
        <ButtonNDL
        type="secondary"
          onClick={() => props.setIsDeleteVal(props.id, true, props.ind)}
          value={props.BtnValue2}
        />
      </Grid>
    </Grid>
  );
};

export default ApproveButton;

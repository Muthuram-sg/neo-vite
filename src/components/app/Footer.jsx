import React from "react";
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL"
// eslint-disable-next-line no-unused-vars
const preventDefault = (event) => event.preventDefault();
const Footer = () => (
  <div style={{ margin: "auto", borderTop: "1px solid " }}>

    <Grid container justify={"center"} spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="caption" align={"center"}>
          © 2020 INDEC-4.0 | Saint-Gobain
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography align={"right"} gutterBottom color={"textSecondary"}>
          <a id='mail-contact' color='inherit' href="mailto:Rokesh.OP@saint-gobain.com;Srivatsan.R@saint-gobain.com?subject=Feedback for IIOT - Web">Contact </a> |
          <Typography style={{ display: 'inline-block' }}>&nbsp;
            <a id='ems-docs' color='inherit' target="_blank" href="https://docs.ems.indec4.saint-gobain.com/">Docs</a></Typography>
        </Typography>
      </Grid>
    </Grid>
  </div>
);

Footer.propTypes = {};
Footer.defaultProps = {};

export default Footer;

import React from 'react';
import Grid from 'components/Core/GridNDL' 
import KpiCards from "components/Core/KPICards/KpiCardsNDL" 

const LandingToolbar = React.lazy(() => import('./components/LandingToolbar'));
const LandingFooter = React.lazy(() => import('./components/LandingFooter'));

export default function AccessLayout() {

    return (
        <KpiCards>
            <Grid>
                <LandingToolbar />
                {/* <RequestAccess /> */}
                <LandingFooter />
            </Grid>
        </KpiCards>
    );
}
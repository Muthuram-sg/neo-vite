import React, { useEffect, useState } from "react";
import Grid from "components/Core/GridNDL";
import useReleaseNotes from "Hooks/HygraphContent/UseReleseNote";
import moment from "moment";
import TypographyNDL from "components/Core/Typography/TypographyNDL";

const Index = () => {
  // NOSONAR  - skip next line
  const { releaseloading, releasedata } = useReleaseNotes();//NOSONAR
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (releasedata && releasedata.length > 0) {
      releasedata.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSelectedIndex(0);
      setActiveCard(0);
    }
  }, [releasedata]);

  const handleClick = (index) => {
    setSelectedIndex(index);
    setActiveCard(index);
  };

  const renderCardDetails = (index) => {
    const selectedData = releasedata[index];
    // NOSONAR  start -  skip next line
    return (
      <div>
        <div className="flex items-center mb-4">
          <div>
            <TypographyNDL
              value={"Release Update -" + " " + "\u00A0"} 
              variant="heading-02-xs"
            />

          </div>
        <div className='text-[18px] font-semibold leading-5 text-Text-text-primary dark:text-Text-text-primary-dark font-geist-sans'
            dangerouslySetInnerHTML={{
              __html: moment(selectedData ? selectedData.createdAt &&  selectedData.createdAt ? selectedData.createdAt: "" :"").format(
                "MMM DD, YYYY"
              ),
            }}
          ></div>
        </div>
        <div >
        <div
         className="text-Text-text-primary dark:text-Text-text-primary-dark font-geist-sans custom-list highGraph-content"
          dangerouslySetInnerHTML={{
            __html: selectedData &&  selectedData.content && selectedData.content.html ? selectedData.content.html : "",
          }}
        ></div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark p-4 h-screen">
 <Grid container spacing={2}>
      <Grid item xs={3}>
        <div 
             className="border min-h-[94vh] rounded-xl pt-8px border-Border-border-50 dark:border-Border-border-dark-50"
        > {releasedata && releasedata.length > 0 ? (
          releasedata.map((x, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                cursor: "pointer",
              }}
              onClick={() => handleClick(index)}
            >
              <div className="border-b flex flex-col gap-1 border-Border-border-50 dark:border-Border-border-dark-50"
               
              >
                <TypographyNDL
                  value={moment(x.createdAt).format("MMM DD, YYYY")}
                  variant={activeCard === index ? "label-02-s"   :"label-01-s"}
                  color={ activeCard === index ? "primary" : "tertiary"}
                />
                <TypographyNDL
                  value={x.category.join(", ")}
                  variant={activeCard === index ? "label-02-s"   :"label-01-s"}
                  color={ activeCard === index ? "primary" : "tertiary"}

                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
             <TypographyNDL
            value={"No release data available"}
            variant="label-01-s"
            style={{ margin: "20px 0" }}
          />
          </div>
         
        )}
        </div>
       
      </Grid>

      <Grid item xs={6}>
        {selectedIndex !== null && (
          <div style={{ padding: "8px" }}>
            {renderCardDetails(selectedIndex)}
          </div>
        )}
      </Grid>
      <Grid item xs={3}>
      </Grid>
    </Grid>
    </div>
   // NOSONAR  end -  skip design 

  );
};

export default Index;

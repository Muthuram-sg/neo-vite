

const getTagprops = (severity) => { //NOSONAR
    
    let tagtext = severity === 1 ? "Minor" : severity === 2 ? "Moderate" : severity === 3 ? "Severe"  :severity === -1 ? "No Faults" : "No Data"
    let tagcolor = severity === 1 ? "warning01-alt" : severity === 2 ? "warning02-alt" : severity === 3 ? "error-alt" :severity === -1 ? "success-alt" : "neutral-alt"
    let textcolor = severity ===1 ?  "#7D6200" :   (severity === 2 ||  severity ===3 || severity === -1)  ? "#FFF" : "#161616"
    let stockColor= severity === 1 ? "#FFC53D" : severity === 2 ? "#EF5F00" : severity === 3 ? "#CE2C31" :severity === -1 ? "#30A46c" : "#E0E0E0"
    return [tagtext, tagcolor, textcolor,stockColor]
}


function capitalizeFLetter(value) {
    return (value ? value.charAt(0).toUpperCase() +
        value.slice(1): '');
}



const common = {
    getTagprops: getTagprops,
    capitalizeFLetter : capitalizeFLetter 

  };
export default common;

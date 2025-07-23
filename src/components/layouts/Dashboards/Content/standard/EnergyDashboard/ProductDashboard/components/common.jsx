import moment from "moment";






const COLORS = ["#104C1A", "#F47180", "#856A00", "#FFA629", "#06356A",
    "#E854E8", "#400868", "#680813", "#AD6500", "#6FAFF6",
    "#A338F0", "#704200", "#F797A2", "#82BAF8", "#630D63",
    "#FFE47A", "#F0384D", "#FFE98F", "#7A0FC7", "#FF9D14"
];


const monthNames = [{ id: 0, name: "January" }, { id: 1, name: "February" }, { id: 2, name: "March" }, { id: 3, name: "April" }, { id: 4, name: "May" }, { id: 5, name: "June" }, { id: 6, name: "July" }, { id: 7, name: "August" }, { id: 8, name: "September" }, { id: 9, name: "October" }, { id: 10, name: "November" }, { id: 11, name: "December" }];


const getDates = (month, year, ProdSqmtRange) => {
    let days = new Date(year, month + 1, 0).getDate()
    let dayNum = 0
    if (ProdSqmtRange.start.getMonth() === new Date(year, month + 1, 0).getMonth()) {
        days = days - ProdSqmtRange.start.getDate() + 1
        dayNum = ProdSqmtRange.start.getDate()
    } else if (ProdSqmtRange.end.getMonth() === new Date(year, month + 1, 0).getMonth()) {
        days = ProdSqmtRange.end.getDate()
    }

   return Array.from(new Array(days), (val, index) => {
      
        return { "day": moment(new Date(year, month, dayNum ? (dayNum + index) : (index + 1))).format("DD MMM"), "energy": 0, "products": [], "Weight": 0, "value": 0 }

    });
   
    
}

function setfactortext(factor) {
    if (factor === 1) {
        return ["area", "sqmt"]
    }
    else if (factor === 2) {
        return ["Tonnage", "ton"]
    }else if(factor === 3){
        return ["area", " 6 sqmm basis"]
    }
}

function getPrimaryFilterName (headPlant) {

    if (headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.prod_type === 3) {
        return "Family"
    }
    else if(headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.prod_type === 2){
        return "Thickness"
    } 
    else if (headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.prod_type === 1){
        return "Tint"
    }
}

const common = {
    monthNames : monthNames,
    
    getDates : getDates,

    COLORS : COLORS,

    setfactortext : setfactortext,

    getPrimaryFilterName : getPrimaryFilterName
    
}
export default common;
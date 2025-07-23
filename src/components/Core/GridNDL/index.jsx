import React from 'react'; 
function GridNDL(props){ 
    let SMGrid = props.sm ? props.sm : props.xs
    let MDGrid = props.md ? props.md : SMGrid
    let gridSpan = props.lg ? props.lg : MDGrid
    let spacing = props.spacing === 0 ? 0 : 4
    return(
        <React.Fragment>
            {props.container && 
            <div id={props.id} onClick={props.onClick} className={`grid grid-cols-${props.size ? props.size : 12} ${props.size === 16 ? 'grid-16':''} gap-${props.spacing ? props.spacing : spacing} ${props.className}`} style={props.style}>
                {props.children}  
            </div>
            }
            {!props.container &&
            <div id={props.id} className={`col-span-${gridSpan} md:col-span-${props.md ? props.md : gridSpan} xs:col-span-${props.xs ? props.xs : gridSpan} sm:col-span-${props.sm ? props.sm : gridSpan} lg:col-span-${props.lg ? props.lg : gridSpan} ${props.className}`} style={props.style}>
                {props.children}    
            </div>
            }
            
        </React.Fragment>
    )
}
export default GridNDL;
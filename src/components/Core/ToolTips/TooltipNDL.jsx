import React,{useEffect, useRef} from "react";   


export default function TooltipNDL(props) { 
    const ref = useRef(null);
    const [TopR,setTopR] =React.useState(0)
    // eslint-disable-next-line no-unused-vars
    useEffect(() => { 
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [TopR]);
      const handleScroll = event => { 
         
        let posR = Number(TopR+window.pageYOffset)
        document.getElementById('customTooltipright').style.top = posR+'px';
    };
    const styleFn =()=>{
        document.getElementById('customTooltipright').style.display ='none';
        document.getElementById('customTooltiptop').style.display ='none';
        document.getElementById('customTooltipbot').style.display ='none';
        document.body.removeAttribute("style") 
        setTopR(0)
    }
    return ( 
       <div onClick={props.onClick} style={{...props.style}}>
            <div align={props?.type === 'dashboard' ? '' :'center'} ref={ref} style={{width:props?.type === 'dashboard' ? '100%' : 'fit-content',zIndex:"2",display:'flex'}} 
            onClick={(e)=>styleFn()}
            
            onMouseLeave={(e)=>styleFn()}
            onMouseEnter={(e)=> {
                let divpos = ref.current.getBoundingClientRect() 
                let divwid = ((divpos.width).toFixed(0)/2)
                let screenH = window.innerHeight - ref.current.getBoundingClientRect().top
                if(props.placement === 'top'){
                    
                    
                    let topY = divpos.top
                    let leftx = divpos.x
                    let left = leftx + (divwid)
                    document.getElementById('customTooltiptop').style.display ='block';
                    document.getElementById('customTooltiptop').style.top = topY+'px';
                    document.getElementById('customTooltiptop').style.left = left+'px';
                    document.getElementById('customTooltiptop').innerText =props.title;
                    let tooldiv =document.getElementById('customTooltiptop').offsetWidth
                    let toolH =document.getElementById('customTooltiptop').offsetHeight
                    let toolSize = tooldiv/divpos.width
                    if(toolH > 32){
                        document.getElementById('customTooltiptop').style.top = (topY-(toolH/2))+'px';
                    }
                    if(tooldiv > divpos.width){
 
                        let setWidth= (tooldiv - divpos.width)/toolSize.toFixed(0)
                        document.getElementById('customTooltiptop').style.left = (left-setWidth)+'px';
                    }
                    if(divpos.width < 60 ){
                        let setMargin = divpos.width /2
                        document.getElementById('customTooltiptop').style.marginLeft='-'+setMargin+"px"
                    }else{
                        document.getElementById('customTooltiptop').style.marginLeft="-30px"
                    }
                }else if(props.placement === 'right'){
                    let divwidth= divpos.width
                    let top = divpos.top + Number(window.pageYOffset)
                    let leftY = divpos.left+ divwidth
                    setTopR(divpos.top)
                    document.getElementById('customTooltipright').style.display ='block';
                    document.getElementById('customTooltipright').style.top = top+'px';
                    document.getElementById('customTooltipright').style.left = leftY+'px';
                    document.getElementById('customTooltipright').innerText =props.title;
                    document.getElementById('customTooltipright').style.marginLeft="0px"
                }else if(props.placement === 'bottom'){
                    let scrolY = window.scrollY
                    // console.log(divpos,"divposdivpos",window.scrollY)
                    let leftx = divpos.x 
                    let left = leftx + (divwid)
                    let topY = Number((divpos.y)+divpos.height+5+scrolY)
                    // console.log(screenH,"screenH",topY,scrolY)
                    document.getElementById('customTooltipbot').style.display ='block';
                    document.getElementById('customTooltipbot').style.top = (topY)+'px';
                    document.getElementById('customTooltipbot').style.left = left+'px';
                    document.getElementById('customTooltipbot').innerText =props.title;
                    let tooldiv =document.getElementById('customTooltipbot').offsetWidth
                    if(tooldiv > divpos.width){
                        let setWidth= (tooldiv - divpos.width)/2
                        document.getElementById('customTooltipbot').style.left = (left-setWidth)+'px';
                    }
                    if(divpos.width < 60){
                        let setMargin = divpos.width /2
                        document.getElementById('customTooltipbot').style.marginLeft='-'+setMargin+"px"
                    }else{
                        document.getElementById('customTooltipbot').style.marginLeft="-60px"
                    }
                
                }
                

            }}
            >
                {props.children}
            </div> 
            </div>
    )
}
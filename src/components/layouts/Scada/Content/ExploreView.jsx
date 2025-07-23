/* eslint-disable no-unused-vars */
import React,{useState,useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import ExploreModel from './ExploreModel';

const ExploreView= React.forwardRef((props, ref) => { 
  
    const [OpenModel, setOpenModel] = useState(false);
    

    const EntityRef = useRef();

    

    useImperativeHandle(ref, () =>
    (
      {
        handleEntityDialog: () => {
          setOpenModel(true) 
           
        },
         
      }
    )
    )

    function handleEntityDialogClose(){
        setOpenModel(false)
    }

    return(
        <ModalNDL onClose={handleEntityDialogClose}  open={OpenModel}>
            
            <ExploreModel open={OpenModel} onClose={handleEntityDialogClose} detail={props.detail} />
        </ModalNDL>
    )
})
export default ExploreView;
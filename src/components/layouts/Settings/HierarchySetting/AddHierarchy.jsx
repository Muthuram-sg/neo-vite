import React, { useState,forwardRef, useImperativeHandle, useRef } from 'react'; 
import Button from 'components/Core/ButtonNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import { useTranslation } from 'react-i18next';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import TagNDL from 'components/Core/Tags/TagNDL';
import Plus from 'assets/neo_icons/Menu/meganta_Plus.svg?react';
import XIcon from 'assets/neo_icons/Menu/meganta_X.svg?react';


const AddHierarchy = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const nameRef = useRef();
    const [hierarchy,setHierarchy] = useState(null);
    const [selectedCategory,setselectedCategory] = useState(null)
    const [categoriesOption,setcategoriesOption] = useState(props.instrumentcategory)
   
    useImperativeHandle(ref,()=>({
        openDialog:(hier)=>{ handleDialogOpen(hier)},
    
    }))
    const handleDialogOpen = (hier) =>{  
        nameRef.current.value= hier.name
        setHierarchy(hier.hierarchy ? hier.hierarchy : '')
    }
    const handleDialogHieClose=()=>{
        props.handleDialogHieClose() 
        setHierarchy('')
    }

    // const handleLabelSelect=(id,reverse)=>{
    //     setselectedCategory(id)
    //     if(reverse){
    //         setcategoriesOption(categoriesOption.map(x=>{
    //                 return {...x,selected:false}
    //         }))
    //         setselectedCategory(null)
    //     }else{
    //         setcategoriesOption(categoriesOption.map(x=>{
    //             if(x.id === id){
    //                 return {...x,selected:true}
    //             }else{
    //                 return {...x,selected:false}
    //             }
    //         }))
    //     }
       
    // }
    return (
        <React.Fragment>
            <ModalHeaderNDL>
            <TypographyNDL variant="heading-02-xs" model value={t('Create') + t('Hierarchy')}/>        
               
            </ModalHeaderNDL>
            <ModalContentNDL>
            <InputFieldNDL label='Hierarchy Name' placeholder={t("Enter hierarchy name")} inputRef={nameRef}  helperText={"This will appear in the overview"} /> 
            {/* <br></br>
            <TypographyNDL value={'Label Tag'} style={{paddingBottom:"8px"}} variant={'label-02-s'} />
            <div className='flex gap-1 pb-1'>
            {
  categoriesOption.map(x => (
    <React.Fragment key={x.id}>
      {x.selected ? (
        <TagNDL
          name={
            <TypographyNDL
              variant={"Body2Reg"}
              style={{ whiteSpace: "nowrap" }}
              align="center"
              value={x.name}
            />
          }
          style={{ backgroundColor: "#ADD7FD",cursor:"pointer" }}
          Lefticon={XIcon}
          onClick={() => handleLabelSelect(x.id, true)}
        />
      ) : (
        <TagNDL
          name={
            <TypographyNDL
              variant={"Body2Reg"}
              style={{ whiteSpace: "nowrap" }}
              align="center"
              value={x.name}
            />
          }
          style={{ backgroundColor: "#FFFFFF",cursor:"pointer"}}
          bordercolor={{border:"1px solid #104775"}}
          Lefticon={Plus}
          onClick={() => handleLabelSelect(x.id)}
        />
      )}
    </React.Fragment>
  ))
        }

                                    </div>

<TypographyNDL value={"Select any one relevant tag associated with this hierarchy"} variant={'lable-01-s'} color={'secondary'}/> */}
            </ModalContentNDL>
            <ModalFooterNDL>
            <Button type='secondary'  onClick={handleDialogHieClose} value={t('Cancel')}/> 
                {
                hierarchy ?
                    <Button value={t('Create')}  onClick={() => props.addDuplicateHierarchy(nameRef.current.value,hierarchy)} /> : <Button value={t('Create')}  onClick={() => props.addNewHierarchy(nameRef.current.value)} />

                } 
            </ModalFooterNDL>
            </React.Fragment>
    )
})
export default AddHierarchy;
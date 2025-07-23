import React, { useEffect, useRef } from 'react';
import { hierNodeName } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil'; 
import Grid from 'components/Core/GridNDL'
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';


function HierarchyHeader(props) { 
    const nameRef = useRef();
    

    const [nodename, setNodeName] = useRecoilState(hierNodeName);
    useEffect(() => {
        setNodeName(props.hierName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
    return (
        <div className=' flex items-center justify-center h-[40px] '>
        <Grid style={{width:"100%"}} container spacing={0}>
            <Grid item xs={12}>
                {
                    !props.isEdit ?
                        <ParagraphText  variant="heading-01-xs"  color='secondary' value={props.hierName}  />
                        : <InputFieldNDL
                            size="small"
                            inputRef={nameRef}
                            value={nodename}
                            disabled={!props.isEdit}
                            onChange={(e) => setNodeName(e.target.value)} />
                }
            </Grid>
        </Grid>
        </div>
    )
}
const isNotRender = (prev, next) => {
    return prev.hierName !== next.hierName || prev.isEdit !== next.isEdit ? false : true;
}
export default React.memo(HierarchyHeader, isNotRender);

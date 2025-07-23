import React,{ useRef } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import Button from "components/Core/ButtonNDL" 
import InputFieldNDL from "components/Core/InputFieldNDL";
import Grid from 'components/Core/GridNDL'; 
import { useTranslation } from 'react-i18next';
function PartComment(props){
    const commentDescRef = useRef();
    const {t} = useTranslation();
    const createComment = () =>{
        props.createComment(commentDescRef.current?commentDescRef.current.value:"")
    }
    return(
        <ModalNDL  onClose={props.handleCommentDialogClose} maxWidth={"xs"} open={props.commentDialog}>
            <ModalHeaderNDL>
            <TypographyNDL variant="heading-02-m" value={t("Part Comments")}/>
            </ModalHeaderNDL>
            <ModalContentNDL>
            <Grid container>
                    <Grid item xs={12}>
                {props.parameters && props.parameters.map((param) => 
                        <div key={param.parameter}>  
                            <InputFieldNDL 
                                onChange={(e)=>props.handleCommentChange(e)}
                                label={param.parameter}
                                id="description"
                                multiline
                                maxRows={2}
                                placeholder={t("Type here")}
                                dynamic={true} 
                            />
                        </div> 
                )
                }
                <div> 
                    <InputFieldNDL 
                        inputRef={commentDescRef}
                        label={"Default"}
                        id="description"
                        multiline
                        maxRows={2}
                        placeholder={t("Type here")}
                    />
                </div>
                </Grid>
                </Grid>
            </ModalContentNDL>
            <ModalFooterNDL>
            <Button type="secondary" value={t('Cancel')} onClick={props.handleCommentDialogClose} />
                <Button value={t("Submit")} onClick={() => createComment()} />
            </ModalFooterNDL>
        </ModalNDL>
    )
}
const isRender = (prev, next) => {
    return prev.commentDialog !== next.commentDialog ? false : true
}
const PartCommentDialog = React.memo(PartComment, isRender)
export default PartCommentDialog;

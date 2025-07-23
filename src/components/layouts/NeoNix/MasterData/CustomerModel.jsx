import React, { useState, useRef, useImperativeHandle } from "react";
// import Tabs from "./Switchable_Tabs";
 import AddCustomer from "./AddCustomer";

 const PolicyModel = React.forwardRef((props, ref) => {
   const [instrumentDialog, setInstrumentDialog] = useState(false);
   const AddCustomerref = useRef();

   useImperativeHandle(ref, () => ({
    handleFormulatDialogAdd: () => {
      setInstrumentDialog(true);
       setTimeout(() => {
         AddCustomerref.current.handleFormulatDialogAdd();
      }, 200);
     },
     handleFormulaCrudDialogDuplicate: (id, data) => {
       setInstrumentDialog(true);
       setTimeout(() => {
        AddCustomerref.current.handleFormulaCrudDialogDuplicate(id, data);     }, 200);
     },
    handleDeleteDialogOpen: (id, data) => {
       setInstrumentDialog(true);
       setTimeout(() => {
         AddCustomerref.current.handleDeleteDialogOpen(id, data);
      }, 200);
     },
     handleEditDialogOpen: (id, data) => {
       setInstrumentDialog(true);
       setTimeout(() => {
         AddCustomerref.current.handleEditDialogOpen(id, data);
       }, 200);
    },
   }));

   function handleInstrumentDialogClose() {
    setInstrumentDialog(false);
   }
   return (
     <AddCustomer
       handlepageChange={props.handlepageChange}
      ref={AddCustomerref}
      formulaDialog={instrumentDialog}
      refreshTable={props.refreshTable}     />
  );
 });
 export default PolicyModel;

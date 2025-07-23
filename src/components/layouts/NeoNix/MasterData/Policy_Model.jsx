// import React, { useState, useRef, useImperativeHandle } from "react";
// import Tabs from "./Switchable_Tabs";
// import Newpolicy from "./Newpolicy";

// const PolicyModel = React.forwardRef((props, ref) => {
//   const [instrumentDialog, setInstrumentDialog] = useState(false);
//   const Newpolicyref = useRef();

//   useImperativeHandle(ref, () => ({
//     handleFormulatDialogAdd: () => {
//       setInstrumentDialog(true);
//       setTimeout(() => {
//         Newpolicyref.current.handleFormulatDialogAdd();
//       }, 200);
//     },
//     handleFormulaCrudDialogDuplicate: (id, data) => {
//       setInstrumentDialog(true);
//       setTimeout(() => {
//         Newpolicyref.current.handleFormulaCrudDialogDuplicate(id, data);
//       }, 200);
//     },
//     handleDeleteDialogOpen: (id, data) => {
//       setInstrumentDialog(true);
//       setTimeout(() => {
//         Newpolicyref.current.handleDeleteDialogOpen(id, data);
//       }, 200);
//     },
//     handleEditDialogOpen: (id, data) => {
//       setInstrumentDialog(true);
//       setTimeout(() => {
//         Newpolicyref.current.handleEditDialogOpen(id, data);
//       }, 200);
//     },
//   }));

//   function handleInstrumentDialogClose() {
//     setInstrumentDialog(false);
//   }
//   return (
//     <Newpolicy
//       handlepageChange={props.handlepageChange}
//       ref={Newpolicyref}
//       formulaDialog={instrumentDialog}
//       refreshTable={props.refreshTable}
//     />
//   );
// });
// export default PolicyModel;

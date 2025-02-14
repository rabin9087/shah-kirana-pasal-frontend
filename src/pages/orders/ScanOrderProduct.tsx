// import React, { useState } from "react";
// import { useZxing } from "react-zxing";
// import Modal from 'react-modal';
// const ScanOrderProduct = () => {

//     const [modalIsOpen, setIsOpen] = React.useState(false);
//     function openModal() {
//         setIsOpen(true);
//     }
//     function closeModal() {
//         setIsOpen(false);
//     }

//   return (
//         <Modal
//             isOpen={modalIsOpen}
//             onRequestClose={closeModal}
//             contentLabel="Example Modal"
//         >
          
//         </Modal>
//   )
// }
// export default ScanOrderProduct

// export const ScanProduct = () => {

//     const [isFlashOn, setIsFlashOn] = useState(false);
//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const { ref } = useZxing({
//         onDecodeResult(result) {
//             if (result.getText() !== "") {
//              return   console.log(result)
//             }
//         },
//     }) 
// }
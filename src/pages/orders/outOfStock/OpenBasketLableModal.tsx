import { Button } from '@/components/ui/button';
import LockBodyScroll from '@/utils/LockBodyScroll';
import Modal from 'react-modal';
type OpenBasketLableModalProps = {
    isBasketLabelOpen: boolean;
    setIsOpenPicking?: React.Dispatch<React.SetStateAction<boolean>>;
    closeModal: () => void;
    orderNumber:  string | number;
};
const OpenBasketLableModal = ({ isBasketLabelOpen, closeModal }: OpenBasketLableModalProps) => {
    LockBodyScroll(isBasketLabelOpen)
  return (
      <Modal
          isOpen={isBasketLabelOpen}
          onRequestClose={closeModal}
          overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          className="bg-white mt-20 p-6 rounded-xl shadow-xl w-[90%] max-w-md max-h-[90vh] overflow-hidden"
      >
          {/* Scrollable Content */}
          <div className="flex justify-center items-center overflow-y-auto max-h-[70vh] space-y-6">
              {/* Deliver Later Card */}
              <div className="text-center bg-blue-100 p-4 rounded-md shadow-lg flex justify-between items-center">
                  {/* <QRCodeGenerator value ={ orderNumber as string} /> */}
              </div>
        
          </div>

          {/* Footer Button */}
          <div className="flex justify-center mt-6">
              <Button
                  variant="secondary"
                  onClick={closeModal}
                  className="w-[150px] px-6 bg-red-600 hover:bg-red-700 text-white"
              >
                  Close
              </Button>
          </div>
      </Modal>
  )
}
export default OpenBasketLableModal
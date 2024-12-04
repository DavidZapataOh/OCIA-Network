import { Dialog } from '@headlessui/react';
import SecurityAnalysis from './SecurityAnalysis';

const SecurityModal = ({ isOpen, onClose, analysis }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              Detailed Security Analysis
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <SecurityAnalysis analysis={analysis} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SecurityModal; 
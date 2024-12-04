import { Dialog } from '@headlessui/react';
import TestSuiteViewer from './TestSuiteViewer';

const TestModal = ({ isOpen, onClose, testSuite }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-elementBackground rounded-xl shadow-strong border border-muted">
          <div className="flex justify-between items-center p-4 border-b border-muted">
            <Dialog.Title className="text-lg font-semibold text-secondary">
              Test Suite Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-textSecondary hover:text-secondary transition-colors duration-300"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <TestSuiteViewer testSuite={testSuite} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TestModal; 
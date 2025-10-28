import { useContext } from 'react';
import { TransactionContext } from '../hooks/UseTransaction/context';

interface Options {
  accept: string,
  deny: string
}

export default function ConfirmationModal({ options, label }: { options: Options, label: string }) {
  const { actions } = useContext(TransactionContext);

  return (
    <div className="absolute inset-x-0 bottom-25 flex justify-center bg-neutral-800/50 py-2 z-10">
      <div>
        <p>{label}</p>
        <div className="flex flex-row w-full justify-around">
          <button
            className="bg-green-800 px-8 py-1 rounded-lg cursor-pointer"
            onClick={() => actions.updateTransactionLifeCycle(options.accept)}
          >
            Si
          </button>
          <button
            className="bg-red-700 px-8 py-1 rounded-lg cursor-pointer"
            onClick={() => actions.updateTransactionLifeCycle(options.deny)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

interface Handlers {
  accept: () => void;
  deny: () => void;
}

export default function ConfirmationModal(
  { label, handlers }:
    { label: string, handlers: Handlers }
) {
  return (
    <div
      className="
      absolute 
      inset-x-0 
      bottom-20 
      md:bottom-25 
      flex 
      justify-center 
      bg-muted/60 
      py-3 
      md:py-2 
      px-4 
      md:px-0 
      z-10
    ">
      <div className="w-full max-w-md">
        <p className="text-sm md:text-base text-center mb-3 md:mb-2 text-foreground font-normal">
          {label}
        </p>
        <div className="flex flex-row gap-3 md:gap-4 w-full justify-center">
          <button
            className="
              bg-green-800 
              px-6 
              md:px-8 
              py-2 
              md:py-1 
              rounded-lg 
              cursor-pointer 
              text-white 
              text-sm 
              md:text-base 
              font-medium 
              hover:bg-green-700 
              transition-colors 
              min-w-[80px] 
              md:min-w-0
            "
            onClick={() => handlers.accept()}
          >
            Sí
          </button>
          <button
            className="
              bg-red-700 
              px-6 
              md:px-8 
              py-2 
              md:py-1 
              rounded-lg 
              cursor-pointer 
              text-white 
              text-sm 
              md:text-base 
              font-medium 
              hover:bg-red-600 
              transition-colors 
              min-w-[80px] 
              md:min-w-0
            "
            onClick={() => handlers.deny()}
          >
            No
          </button>
        </div>
      </div>
    </div>

  );
}

export default function QuantitySelector() {
  return (
    <div className="relative flex items-center max-w-[8rem] border border-neutral-300 rounded-s-lg rounded-e-lg">
      <button
        type="button"
        id="decrement-button"
        data-input-counter-decrement="quantity-input"
        className={`bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:border-neutral-600 
                                hover:bg-neutral-200 border border-neutral-300 rounded-s-lg p-3 h-5 focus:ring-neutral-100 dark:focus:ring-neutral-700 
                                focus:ring-2 focus:outline-none flex items-center`}
      >
        <svg
          className="w-3 h-3 text-neutral-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        id="quantity-input"
        data-input-counter
        aria-describedby="helper-text-explanation"
        className={`flex items-center border-x-0 border-neutral-300 text-center h-full text-neutral-900
                                 focus:ring-blue-500 focus:border-blue-500 w-full
                                dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        placeholder={"2"}
        required
      />
      <button
        type="button"
        id="increment-button"
        data-input-counter-increment="quantity-input"
        className={`bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:border-neutral-600
                                hover:bg-neutral-200 border border-neutral-300 rounded-e-lg p-3 h-5 focus:ring-neutral-100 dark:focus:ring-neutral-700
                                focus:ring-2 focus:outline-none flex items-center`}
      >
        <svg
          className="w-3 h-3 text-neutral-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
}

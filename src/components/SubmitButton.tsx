import { IconType } from 'react-icons';

export function SubmitButton({
  title,
  size,
  Icon,
  isLoading,
}: {
  title: string;
  size: string;
  Icon: IconType;
  isLoading: boolean;
}) {
  return (
    <>
      <button
        type='submit'
        className={` "flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                ${size === 'fit' ? 'w-fit' : 'w-full'}
                `}
        disabled={isLoading}>
        <div
          className={`flex justify-center gap-x-2 ${
            isLoading === true ? 'hidden' : ''
          }`}>
          <p className={` ${isLoading === true ? 'hidden' : ''} `}>{title}</p>
          <div className={` ${Icon === undefined ? 'hidden' : ''} `}>
            <Icon />
          </div>
        </div>
        <div
          className={` ${
            isLoading === true ? 'flex justify-center items-center' : 'hidden'
          }  `}>
          <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white'></div>
        </div>
      </button>
    </>
  );
}

'use client';

// import { toast } from 'react-toastify';
// import { SubmitButton } from './SubmitButton';
// import { useFormState } from 'react-dom';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { SubmitButton } from './SubmitButton';
import { useState } from 'react';
// import { scheduleEmail } from '../../../actions/user/scheduler';

const SchedulerForm = () => {
  const [form, setForm] = useState({
    to: '',
    subject: '',
    message: '',
    schedule: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetForm = () => {
    setForm({
      to: '',
      subject: '',
      message: '',
      schedule: '',
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/schedule-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setSuccess(data.scheduled);
  };
  //   const [state, submitAction] = useFormState(scheduleEmail, null);
  //   const router = useRouter();

  //   useEffect(() => {
  //     if (state?.status !== 200) {
  //       toast.error(state?.message, {
  //         position: 'top-right',
  //         autoClose: 1800,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         onClose: () => {
  //           document.getElementById('subscribeForm').reset();
  //         },
  //       });
  //     } else if (state?.status === 200) {
  //       toast.success(state?.message, {
  //         position: 'top-right',
  //         autoClose: 1800,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         onClose: () => {
  //           document.getElementById('subscribeForm').reset();
  //           router.replace('/login');
  //         },
  //       });
  //     }
  //   }, [router, state]);

  return (
    <>
      <div className='w-3/5 mx-auto'>
        <div className='flex flex-col justify-center p-6'>
          <div className='min-w-full'>
            <form
              //   action={submitAction}
              onSubmit={handleSubmit}
              className='space-y-3'
              id='subscribeForm'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Email To
                </label>
                <div className='mt-2'>
                  <input
                    type='email'
                    name='to'
                    value={form.to}
                    onChange={handleChange}
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='titleOfMail'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Subject
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='subject'
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Enter Message
                </label>
                <div className='mt-2'>
                  <textarea
                    name='message'
                    value={form.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 h-32'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='date'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Select Date
                </label>
                <div className='mt-2'>
                  <input
                    id='date'
                    name='schedule'
                    type='datetime-local'
                    value={form.schedule}
                    onChange={handleChange}
                    required
                    min={getMinDateTime()}
                    className='block w-fit rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 max-sm:w-full'
                  />
                </div>
              </div>
              {success && (
                <p className='mt-4 text-green-600 text-center font-semibold'>
                  Email scheduled successfully!
                </p>
              )}
              <div className='flex max-sm:flex-col max-sm:gap-y-2 sm:flex-row justify-between'>
                <SubmitButton
                  title='Schedule'
                  size='fit'
                  Icon={RiCalendarScheduleLine}
                  isLoading={loading}
                />
                <button
                  type='reset'
                  onClick={handleResetForm}
                  className='flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 w-fit'>
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchedulerForm;

const getMinDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 24);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

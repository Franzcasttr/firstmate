'use client';

import { useState } from 'react';

const SchedulerForm = () => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    delay: '',
    unit: 'seconds',
    webhookUrl: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetForm = () => {
    setForm({
      delay: '',
      unit: 'seconds',
      webhookUrl: '',
      message: '',
    });
  };

  const getDelayInMs = () => {
    const delayNum = parseInt(form.delay);
    if (isNaN(delayNum)) return 0;

    switch (form.unit) {
      case 'seconds':
        return delayNum * 1000;
      case 'minutes':
        return delayNum * 60 * 1000;
      case 'hours':
        return delayNum * 60 * 60 * 1000;
      default:
        return delayNum * 60 * 1000;
    }
  };

  const getButtonText = () => {
    if (!form.delay || form.delay === '0') return 'Send';
    return `Send in ${form.delay} ${form.unit}`;
  };

  const isFormValid = () => {
    return form.delay && form.message && form.webhookUrl;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (
      !form.delay ||
      form.delay === '0' ||
      !form.message ||
      !form.webhookUrl
    ) {
      setErrorMessage('Please fill out all fields');
      return;
    }

    // if (!isFormValid()) return;
    const delayMs = getDelayInMs();
    setLoading(true);
    setStatus(`Scheduling message to be sent in ${form.delay} ${form.unit}...`);
    try {
      const res = await fetch('/api/schedule-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: form.webhookUrl,
          message: `From Francis's Slack Bot: ${form.message}`,
          delayMs,
        }),
      });
      if (res.ok) {
        handleResetForm();
        const data = await res.json();
        setLoading(false);
        setStatus(data.message);
      } else {
        const error = await res.text();
        setLoading(false);
        setStatus(error);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        console.error('Error:', error.message);
        setErrorMessage(`Error: ${error.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-3/5 mx-auto'>
        <div className='flex flex-col justify-center p-6'>
          <div className='min-w-full'>
            <form
              //   action={submitAction}
              // onSubmit={handleSubmit}
              className='space-y-3'
              id='subscribeForm'>
              <div>
                <label
                  htmlFor='delay'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Enter Delay
                </label>
                <div className='mt-2'>
                  <input
                    type='number'
                    name='delay'
                    value={form.delay}
                    onChange={handleChange}
                    id='delay'
                    min='0'
                    placeholder='Enter delay amount'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='unit'
                  className='block mb-2 text-sm font-medium text-gray-900 '>
                  Select an unit
                </label>
                <select
                  name='unit'
                  value={form.unit}
                  onChange={handleChange}
                  id='unit'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '>
                  <option value='seconds'>Seconds</option>
                  <option value='minutes'>Minutes</option>
                  <option value='hours'>Hours</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor='webhookUrl'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Enter Webhook URL
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='webhookUrl'
                    value={form.webhookUrl}
                    onChange={handleChange}
                    id='webhookUrl'
                    min='0'
                    placeholder='https://hooks.slack.com/services/...'
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

              {/* {success && (
                <p className='mt-4 text-green-600 text-center font-semibold'>
                  Email scheduled successfully!
                </p>
              )} */}
              {status ? (
                <div className='mt-4  text-green-600 text-center font-semibold'>
                  {status}
                </div>
              ) : (
                errorMessage && (
                  <p className='mt-4 text-red-600 text-center font-semibold'>
                    {errorMessage}
                  </p>
                )
              )}
              <div className='flex max-sm:flex-col max-sm:gap-y-2 sm:flex-row justify-between'>
                <button
                  type='button'
                  onClick={handleSubmit}
                  className='flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-fit'
                  disabled={loading}>
                  {getButtonText()}
                  <div
                    className={` ${
                      loading === true
                        ? 'flex justify-center items-center'
                        : 'hidden'
                    }  `}>
                    <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white'></div>
                  </div>
                </button>
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

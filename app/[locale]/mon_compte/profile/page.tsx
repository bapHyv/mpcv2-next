'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/authContext';
import { UpdatedUserData, UserData } from '@/app/types/profileTypes';

export default function Profile() {
  const { userData, updateUser, loading } = useAuth();
  const [formData, setFormData] = useState<UserData>({
    mail: '',
    firstname: '',
    lastname: '',
    optInMarketing: false,
    oldPassword: '',
    newPassword: '',
  });

  // Update formData when userData is available
  useEffect(() => {
    if (userData) {
      setFormData({
        mail: userData.mail || '',
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        optInMarketing: userData.optInMarketing || false,
        oldPassword: '',
        newPassword: '',
      });
    }
  }, [userData]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target.checked; // Handle checkbox
    const { name, value, type } = target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? isChecked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Pass only filled fields to updateUser to avoid unnecessary data submission
    const payload: UserData = { ...formData };
    if (!payload.oldPassword) delete payload.oldPassword;
    if (!payload.newPassword) delete payload.newPassword;
    await updateUser(payload);
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-neutral-100">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-100">Use a permanent address where you can receive mail.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 dark:text-neutral-100">
            <div className="sm:col-span-3">
              <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
                First name
              </label>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstname && formData.firstname}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="mail" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="mail"
                  name="mail"
                  type="email"
                  autoComplete="email"
                  value={formData.mail}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="oldPassword" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
                Current Password
              </label>
              <div className="mt-2">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
}

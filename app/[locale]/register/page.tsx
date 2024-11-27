"use client"
// import { getTranslations } from "next-intl/server";
import { useState } from "react";
import { useAuth } from '../../context/authContext';

export default  function Login({ locale }: { locale: string }) {
  // const t = await getTranslations({ locale, namespace: "register" });

  const { register } = useAuth();
  const [user, setUser] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(user);
  };


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={`/canna-vert.png`}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-neutral-100">
            Sign up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-green   sm:text-sm sm:leading-6"
                  onChange={e => setUser({...user, username : e.target.value})}

                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100" >
                  Password
                </label>

              </div>
              <div className="mt-2">  
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-green sm:text-sm sm:leading-6"
                  onChange={e => setUser({...user, password : e.target.value})}
             />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-light-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:ring-1  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
} 
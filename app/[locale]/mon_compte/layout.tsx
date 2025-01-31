import { ReactNode } from 'react';
import AccountHeader from '../../components/AccountHeader'




const AccountLayout = ({ children, params: { locale }, }: Readonly<{ children: React.ReactNode; params: { locale: string }; }>) => {
  
  return (
    <div className=''>
      <div className="hidden sm:block">
        <AccountHeader locale={locale} />
      </div>
      <main className="min-h-screen">{children}</main>

    </div>
  );
};

export default AccountLayout;
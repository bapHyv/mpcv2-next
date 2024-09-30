import { ReactNode } from 'react';
import AccountHeader from '../../components/AccountHeader'




const AccountLayout = ({ children, params: { locale }, }: Readonly<{ children: React.ReactNode; params: { locale: string }; }>) => {
  
  return (
    <div className=''>
      <AccountHeader locale={locale} />
      <main className="min-h-screen">{children}</main>

    </div>
  );
};

export default AccountLayout;
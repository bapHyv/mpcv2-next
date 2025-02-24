import AccountHeader from "@/app/components/AccountHeader";

const AccountLayout = ({ children, params: { locale } }: Readonly<{ children: React.ReactNode; params: { locale: string } }>) => {
  return (
    <>
      <div className="hidden sm:block">
        <AccountHeader locale={locale} />
      </div>
      {children}
    </>
  );
};

export default AccountLayout;
